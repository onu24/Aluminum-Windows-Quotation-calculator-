import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { QuotationData } from '@/lib/models';

export async function PUT(request: NextRequest) {
  try {
    const body: Partial<QuotationData> = await request.json();
    
    const client = await clientPromise;
    const db = client.db('window_quotation');
    const collection = db.collection('quotation_data');

    // Get current data
    const currentData = await collection.findOne({}, { sort: { version: -1 } });
    
    if (!currentData) {
      return NextResponse.json(
        { error: 'No quotation data found to update' },
        { status: 404 }
      );
    }

    // Update data (exclude _id from currentData, MongoDB will generate new one)
    const { _id, ...currentDataWithoutId } = currentData as any;
    const updatedData = {
      ...currentDataWithoutId,
      ...body,
      lastUpdated: new Date(),
      version: (currentData.version || 1) + 1
    };

    // Insert as new version
    await collection.insertOne(updatedData);

    return NextResponse.json({
      message: 'Quotation data updated successfully',
      version: updatedData.version
    });
  } catch (error: any) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update quotation data' },
      { status: 500 }
    );
  }
}
