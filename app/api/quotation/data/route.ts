import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('window_quotation');
    const collection = db.collection('quotation_data');
    
    const quotationData = await collection.findOne({}, { sort: { lastUpdated: -1 } });
    
    if (!quotationData) {
      return NextResponse.json(
        { error: 'No quotation data found' },
        { status: 404 }
      );
    }

    // Remove MongoDB _id and convert to JSON
    const { _id, ...data } = quotationData;
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching quotation data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quotation data' },
      { status: 500 }
    );
  }
}
