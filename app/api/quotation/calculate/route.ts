import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { calculateWindowQuotation } from '@/lib/calculator';
import { WindowCalculationInput } from '@/lib/models';

export async function POST(request: NextRequest) {
  try {
    const body: WindowCalculationInput = await request.json();
    
    // Validate input
    if (!body.width || !body.height || body.width <= 0 || body.height <= 0) {
      return NextResponse.json(
        { error: 'Invalid dimensions. Width and height must be positive numbers.' },
        { status: 400 }
      );
    }

    // Get quotation data from database
    const client = await clientPromise;
    const db = client.db('window_quotation');
    const collection = db.collection('quotation_data');
    
    const quotationData = await collection.findOne({}, { sort: { lastUpdated: -1 } });
    
    if (!quotationData) {
      return NextResponse.json(
        { error: 'No quotation data found. Please upload quotation data first.' },
        { status: 404 }
      );
    }

    // Calculate quotation
    const result = calculateWindowQuotation(body, quotationData as any);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Calculation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to calculate quotation' },
      { status: 500 }
    );
  }
}
