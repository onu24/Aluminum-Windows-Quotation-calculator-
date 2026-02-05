import { NextRequest, NextResponse } from 'next/server';
import { parseQuotationFromBuffer } from '@/lib/pdfParser';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse PDF
    const quotationData = await parseQuotationFromBuffer(buffer);

    return NextResponse.json({
      profiles: quotationData.profiles.map(p => ({
        name: p.name,
        materialCount: p.materials.length,
        materials: p.materials.slice(0, 3) // First 3 materials as sample
      })),
      totalProfiles: quotationData.profiles.length,
      totalMaterials: quotationData.materials.length,
      profileNames: quotationData.profiles.map(p => p.name)
    });
  } catch (error: any) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to parse PDF' },
      { status: 500 }
    );
  }
}
