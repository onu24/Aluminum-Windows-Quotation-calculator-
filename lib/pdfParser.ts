import pdfParse from 'pdf-parse';
import fs from 'fs/promises';
import path from 'path';
import { QuotationData, WindowProfile, Material } from './models';

export async function parseQuotationPDF(filePath: string): Promise<QuotationData> {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const pdfData = await pdfParse(dataBuffer);
    return parsePDFText(pdfData.text);
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file');
  }
}

export async function parseQuotationFromBuffer(buffer: Buffer): Promise<QuotationData> {
  try {
    const pdfData = await pdfParse(buffer);
    return parsePDFText(pdfData.text);
  } catch (error) {
    console.error('Error parsing PDF buffer:', error);
    throw new Error('Failed to parse PDF buffer');
  }
}

function parsePDFText(text: string): QuotationData {
  const profiles: WindowProfile[] = [];
  const allMaterials: Material[] = [];
  const formulas: { [key: string]: { formula: string; description: string } } = {};
  const metadata: QuotationData['metadata'] = {
    currency: 'INR',
    unit: 'mm'
  };

  // Split text into lines for processing
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

  // Enhanced profile detection patterns
  const profilePatterns = [
    /^profile\s*[:\-]?\s*(.+)/i,
    /^window\s+type\s*[:\-]?\s*(.+)/i,
    /^frame\s+type\s*[:\-]?\s*(.+)/i,
    /^system\s*[:\-]?\s*(.+)/i,
    /^(.+?)\s+profile\s*$/i,
    /^(.+?)\s+system\s*$/i,
    /^[A-Z][A-Z\s]{3,}$/, // All caps words (likely headers)
    /^\d+[\.\)]\s*[A-Z][A-Z\s]{2,}$/, // Numbered sections like "1. PROFILE NAME"
    /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s*(?:Profile|System|Type|Window)/i,
    /^Section\s+\d+[:\-]?\s*(.+)/i,
    /^Chapter\s+\d+[:\-]?\s*(.+)/i,
  ];

  // Comprehensive price patterns
  const pricePattern = /(\d+[,\d]*\.?\d*)\s*(?:Rs|INR|₹|USD|\$|per|each|unit)/i;
  const currencyPattern = /(?:Rs|INR|₹|USD|\$)/i;
  
  // Patterns for extracting specific values
  const totalCostPattern = /(?:total|grand\s+total|final\s+amount|amount|cost)\s*[:\-]?\s*(\d+[,\d]*\.?\d*)/i;
  const sqFtPattern = /(?:sq\.?\s*ft|square\s+feet|sqft|sq\s+ft|area)\s*[:\-]?\s*(\d+[,\d]*\.?\d*)/i;
  const valuePerSqFtPattern = /(?:value|price|rate|cost)\s+per\s+sq\.?\s*ft[:\-]?\s*(\d+[,\d]*\.?\d*)/i;
  const unitPricePattern = /(?:unit\s+price|price\s+per\s+unit|rate)\s*[:\-]?\s*(\d+[,\d]*\.?\d*)/i;

  let currentProfile: WindowProfile | null = null;
  let currentMaterials: Material[] = [];
  let materialMap = new Map<string, Material>();
  let inProfileSection = false;
  let profileStartIndex = -1;
  let consecutiveBlankLines = 0;
  let lastMaterialIndex = -1;

  // Extract metadata from the entire text
  const totalCostMatch = text.match(totalCostPattern);
  if (totalCostMatch) {
    metadata.totalCost = parseFloat(totalCostMatch[1].replace(/,/g, ''));
  }

  // Detect currency
  if (text.match(/USD|\$/i)) {
    metadata.currency = 'USD';
  } else if (text.match(/INR|Rs|₹/i)) {
    metadata.currency = 'INR';
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = i < lines.length - 1 ? lines[i + 1] : '';
    const prevLine = i > 0 ? lines[i - 1] : '';
    
    // Track blank lines
    if (line === '') {
      consecutiveBlankLines++;
    } else {
      consecutiveBlankLines = 0;
    }
    
    // Extract profile-specific metadata
    if (currentProfile) {
      // Extract total cost for this profile
      const profileTotalMatch = line.match(totalCostPattern);
      if (profileTotalMatch && !pricePattern.test(line.split(profileTotalMatch[0])[0] || '')) {
        currentProfile.totalCost = parseFloat(profileTotalMatch[1].replace(/,/g, ''));
      }

      // Extract square feet per window
      const profileSqFtMatch = line.match(sqFtPattern);
      if (profileSqFtMatch) {
        currentProfile.sqFtPerWindow = parseFloat(profileSqFtMatch[1].replace(/,/g, ''));
      }

      // Extract value per square foot
      const profileValuePerSqFtMatch = line.match(valuePerSqFtPattern);
      if (profileValuePerSqFtMatch) {
        currentProfile.valuePerSqFt = parseFloat(profileValuePerSqFtMatch[1].replace(/,/g, ''));
      }
    }
    
    // Check if this line is a profile header
    let isProfileHeader = false;
    let profileName = '';
    let profileCode = '';

    for (const pattern of profilePatterns) {
      const match = line.match(pattern);
      if (match) {
        if (!pricePattern.test(line) && line.length > 3 && line.length < 100) {
          isProfileHeader = true;
          profileName = match[1] ? match[1].trim() : line.trim();
          
          // Clean up profile name
          profileName = profileName.replace(/^profile\s*[:\-]?\s*/i, '');
          profileName = profileName.replace(/^window\s+type\s*[:\-]?\s*/i, '');
          profileName = profileName.replace(/^frame\s+type\s*[:\-]?\s*/i, '');
          profileName = profileName.replace(/^system\s*[:\-]?\s*/i, '');
          profileName = profileName.trim();

          // Extract code from profile name (in brackets/parentheses)
          const codeMatch = profileName.match(/[\[\(]([A-Z0-9\-]+)[\]\)]/);
          if (codeMatch) {
            profileCode = codeMatch[1];
            profileName = profileName.replace(/[\[\(][A-Z0-9\-]+[\]\)]/, '').trim();
          }
          
          break;
        }
      }
    }

    // If we found a profile header, save previous profile and start new one
    if (isProfileHeader && profileName) {
      if (currentProfile && currentMaterials.length > 0) {
        currentProfile.materials = [...currentMaterials];
        profiles.push(currentProfile);
      }
      
      currentProfile = {
        name: profileName,
        ...(profileCode && { code: profileCode }),
        materials: []
      };
      currentMaterials = [];
      inProfileSection = true;
      profileStartIndex = i;
      lastMaterialIndex = -1;
      continue;
    }

    // Detect profile boundaries using blank lines
    if (consecutiveBlankLines >= 1 && currentProfile && currentMaterials.length > 0 && i > lastMaterialIndex + 3) {
      let j = i + 1;
      while (j < lines.length && lines[j] === '') j++;
      if (j < lines.length) {
        const potentialHeader = lines[j];
        let looksLikeHeader = false;
        for (const pattern of profilePatterns) {
          if (pattern.test(potentialHeader) && !pricePattern.test(potentialHeader)) {
            looksLikeHeader = true;
            break;
          }
        }
        
        if (looksLikeHeader) {
          currentProfile.materials = [...currentMaterials];
          profiles.push(currentProfile);
          currentProfile = null;
          currentMaterials = [];
          inProfileSection = false;
        }
      }
    }

    // Extract materials with comprehensive parsing
    const priceMatch = line.match(pricePattern);
    if (priceMatch) {
      const parts = line.split(/\s+/);
      const priceValue = parseFloat(priceMatch[1].replace(/,/g, ''));
      
      if (!isNaN(priceValue) && priceValue > 0) {
        const priceIndex = parts.findIndex(p => 
          priceMatch[0].includes(p) || 
          (p.match(/\d+[,\d]*\.?\d*/) && parseFloat(p.replace(/,/g, '')) === priceValue)
        );

        if (priceIndex > 0) {
          let materialName = parts.slice(0, priceIndex).join(' ').trim();
          let unit = 'PCS';
          let code: string | undefined = undefined;
          let category: string | undefined = undefined;
          let description: string | undefined = undefined;

          // Extract unit
          if (priceIndex > 1) {
            const possibleUnit = parts[priceIndex - 1];
            if (possibleUnit.match(/^(M|MTR|METER|METERS|SQ\.?M|SQ\.?MTR|SQ\.?METER|SQFT|SQ\.?FT|PCS|PC|PIECE|PIECES|KG|KGS|LTR|LITRE|LITRES|FT|FEET|FOOT)$/i)) {
              unit = possibleUnit.toUpperCase();
              materialName = parts.slice(0, priceIndex - 1).join(' ').trim();
            }
          }

          // Extract code (in brackets or parentheses)
          const codeMatch = materialName.match(/[\[\(]([A-Z0-9\-]+)[\]\)]/);
          if (codeMatch) {
            code = codeMatch[1];
            materialName = materialName.replace(/[\[\(][A-Z0-9\-]+[\]\)]/, '').trim();
          }

          // Clean material name
          materialName = materialName.replace(/[:\-]+$/, '').trim();
          
          // Extract category (common prefixes)
          const categoryKeywords = ['Frame', 'Glass', 'Hardware', 'Seal', 'Gasket', 'Screw', 'Bolt', 'Handle', 'Lock'];
          for (const keyword of categoryKeywords) {
            if (materialName.toLowerCase().includes(keyword.toLowerCase())) {
              category = keyword;
              break;
            }
          }

          // Extract description (text after colon or dash)
          const descMatch = materialName.match(/[:\-]\s*(.+)/);
          if (descMatch) {
            description = descMatch[1].trim();
            materialName = materialName.split(/[:\-]/)[0].trim();
          }
          
          if (materialName.length >= 2 && !materialName.match(/^[A-Z\s]{20,}$/)) {
            const material: Material = {
              name: materialName,
              unit: unit,
              price: priceValue,
              ...(code && { code }),
              ...(category && { category }),
              ...(description && { description })
            };

            const materialKey = `${materialName}_${priceValue}_${unit}`;
            if (!materialMap.has(materialKey)) {
              materialMap.set(materialKey, material);
              allMaterials.push(material);
            }

            if (currentProfile) {
              currentMaterials.push(material);
              lastMaterialIndex = i;
            } else if (profiles.length === 0) {
              currentProfile = {
                name: 'Standard Window Profile',
                materials: []
              };
              currentMaterials.push(material);
              lastMaterialIndex = i;
            }
          }
        }
      }
    }

    // Extract formulas
    if (line.match(/formula|calculation|formula/i)) {
      const nextLine = lines[i + 1];
      if (nextLine) {
        const formulaName = line.replace(/formula|calculation|:/gi, '').trim();
        formulas[formulaName] = {
          formula: nextLine,
          description: formulaName
        };
      }
    }
  }

  // Add last profile if exists
  if (currentProfile) {
    if (currentMaterials.length > 0) {
      currentProfile.materials = [...currentMaterials];
      profiles.push(currentProfile);
    } else if (allMaterials.length > 0) {
      currentProfile.materials = [...allMaterials];
      profiles.push(currentProfile);
    }
  }

  // If no profiles found but we have materials, create profiles based on material grouping
  if (profiles.length === 0 && allMaterials.length > 0) {
    const materialGroups = new Map<string, Material[]>();
    const codeGroups = new Map<string, Material[]>();
    
    for (const material of allMaterials) {
      if (material.code) {
        if (!codeGroups.has(material.code)) {
          codeGroups.set(material.code, []);
        }
        codeGroups.get(material.code)!.push(material);
      }
      
      const firstWord = material.name.split(/\s+/)[0];
      const skipWords = ['Aluminum', 'Aluminium', 'Glass', 'Frame', 'Window', 'Material', 'Item'];
      if (!skipWords.includes(firstWord)) {
        if (!materialGroups.has(firstWord)) {
          materialGroups.set(firstWord, []);
        }
        materialGroups.get(firstWord)!.push(material);
      }
    }

    if (codeGroups.size > 1) {
      for (const [code, materials] of codeGroups.entries()) {
        profiles.push({
          name: `Profile ${code}`,
          code: code,
          materials: materials
        });
      }
    } else if (materialGroups.size > 1) {
      for (const [groupName, materials] of materialGroups.entries()) {
        profiles.push({
          name: `${groupName} Profile`,
          materials: materials
        });
      }
    } else {
      profiles.push({
        name: 'Standard Window Profile',
        materials: allMaterials
      });
    }
  }

  if (profiles.length === 0) {
    profiles.push({
      name: 'Standard Window',
      materials: []
    });
  }

  return {
    profiles: profiles,
    materials: allMaterials,
    formulas: formulas,
    metadata: metadata,
    lastUpdated: new Date(),
    version: 1
  };
}
