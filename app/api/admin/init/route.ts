import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { parseQuotationPDF } from '@/lib/pdfParser';
import path from 'path';
import fs from 'fs/promises';

export async function POST() {
  try {
    // Initialize with default PDF if exists
    const pdfPath = path.join(process.cwd(), 'public', 'data.pdf');
    
    let quotationData;
    try {
      quotationData = await parseQuotationPDF(pdfPath);
    } catch (error) {
      // If PDF parsing fails, create default data structure
      quotationData = {
        profiles: [{
          name: 'Standard Window',
          materials: [
            { name: 'Aluminum Frame', unit: 'M', price: 500 },
            { name: 'Glass', unit: 'SQ.M', price: 800 },
            { name: 'Screws', unit: 'PCS', price: 5 },
            { name: 'Seal', unit: 'M', price: 50 },
            { name: 'Handle', unit: 'PCS', price: 200 }
          ]
        }],
        materials: [
          { name: 'Aluminum Frame', unit: 'M', price: 500 },
          { name: 'Glass', unit: 'SQ.M', price: 800 },
          { name: 'Screws', unit: 'PCS', price: 5 },
          { name: 'Seal', unit: 'M', price: 50 },
          { name: 'Handle', unit: 'PCS', price: 200 }
        ],
        formulas: {},
        lastUpdated: new Date(),
        version: 1
      };
    }

    // Save to database
    const client = await clientPromise;
    const db = client.db('window_quotation');
    const collection = db.collection('quotation_data');

    // Check if data already exists
    const existing = await collection.findOne({});
    if (existing) {
      return NextResponse.json({
        message: 'Database already initialized',
        version: existing.version
      });
    }

    await collection.insertOne(quotationData);

    return NextResponse.json({
      message: 'Database initialized successfully',
      version: 1,
      profiles: quotationData.profiles.length,
      materials: quotationData.materials.length
    });
  } catch (error: any) {
    console.error('Initialization error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initialize database' },
      { status: 500 }
    );
  }
}
