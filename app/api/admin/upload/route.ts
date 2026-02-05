import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
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

    // Check if file is PDF
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'File must be a PDF' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse PDF
    const quotationData = await parseQuotationFromBuffer(buffer);

    // Save to database
    const client = await clientPromise;
    const db = client.db('window_quotation');
    const collection = db.collection('quotation_data');

    // Get current version
    const currentData = await collection.findOne({}, { sort: { version: -1 } });
    const newVersion = currentData ? (currentData.version || 1) + 1 : 1;

    quotationData.version = newVersion;
    quotationData.lastUpdated = new Date();

    // Insert new version (exclude _id, MongoDB will generate it)
    const { _id, ...dataToInsert } = quotationData;
    await collection.insertOne(dataToInsert as any);

    return NextResponse.json({
      message: 'Quotation data uploaded successfully',
      version: newVersion,
      profiles: quotationData.profiles.length,
      materials: quotationData.materials.length,
      profileNames: quotationData.profiles.map(p => p.name),
      profileDetails: quotationData.profiles.map(p => ({
        name: p.name,
        materialCount: p.materials.length
      }))
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload quotation data' },
      { status: 500 }
    );
  }
}
