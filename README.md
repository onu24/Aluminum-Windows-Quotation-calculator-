# Aluminum Windows Quotation Management Web App

A modern web application for calculating aluminum windows quotations based on dimensions, with an admin portal for managing quotation data from PDF files.

## Features

- 📐 **Quotation Calculator**: Calculate materials and costs based on window dimensions (width, height)
- 📊 **Material Breakdown**: Detailed list of all materials required with quantities and prices
- 💰 **Cost Estimation**: Automatic calculation of total cost including materials
- 📄 **PDF Data Management**: Upload and parse PDF quotation files
- 🔧 **Admin Portal**: Manage quotation data, profiles, and materials
- 🗄️ **MongoDB Integration**: Store and version quotation data
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS

## Tech Stack

- **Next.js 16.1.1** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **MongoDB** - Database for storing quotation data
- **pdf-parse** - PDF parsing library
- **lucide-react** - Modern icon library

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB instance)
- npm, yarn, pnpm, or bun

### Installation

1. **Install dependencies**:
   ```bash
   cd my-app
   npm install
   ```

2. **Set up environment variables**:
   
   Create a `.env.local` file in the `my-app` directory:
   ```env
   MONGO_DB_URL=mongodb+srv://ayan25005_db_user:<db_password>@cluster0.g3lwmc2.mongodb.net/?appName=Cluster0
   ```
   
   Replace `<db_password>` with your actual MongoDB password.

3. **Initialize the database**:
   
   Start the development server and navigate to the admin portal to initialize the database:
   ```bash
   npm run dev
   ```
   
   Then visit `http://localhost:3000/admin` and click "Initialize DB" button.

4. **Upload your quotation PDF**:
   
   - Go to the Admin Portal (`/admin`)
   - Upload your PDF file from `public/data.pdf` or any other quotation PDF
   - The system will parse and store the data

## Usage

### Calculating Quotations

1. Navigate to the home page (`http://localhost:3000`)
2. Enter window dimensions:
   - **Width** (in millimeters)
   - **Height** (in millimeters)
   - **Profile Type** (select from available profiles)
   - **Quantity** (number of windows)
3. Click "Calculate Quotation"
4. View the results:
   - Materials required with quantities
   - Unit prices and total prices
   - Overall total cost

### Admin Portal

1. Navigate to `/admin`
2. **Upload PDF**: Upload a new quotation PDF file
3. **Initialize DB**: Initialize database with default data (if needed)
4. **View Data**: See current quotation data including:
   - Version number
   - Last updated date
   - Number of profiles
   - Number of materials

## Project Structure

```
my-app/
├── app/
│   ├── api/                    # API routes
│   │   ├── quotation/          # Quotation APIs
│   │   └── admin/              # Admin APIs
│   ├── admin/                  # Admin portal page
│   ├── page.tsx                # Main calculator page
│   └── layout.tsx              # Root layout
├── lib/
│   ├── mongodb.ts              # MongoDB connection
│   ├── models.ts               # TypeScript interfaces
│   ├── pdfParser.ts            # PDF parsing utilities
│   └── calculator.ts           # Calculation logic
└── public/
    └── data.pdf                # Default quotation PDF
```

## API Endpoints

### Quotation APIs

- `POST /api/quotation/calculate` - Calculate quotation
  ```json
  {
    "width": 1200,
    "height": 1500,
    "profileType": "Standard Window",
    "quantity": 1
  }
  ```

- `GET /api/quotation/data` - Get current quotation data

### Admin APIs

- `POST /api/admin/upload` - Upload PDF file (FormData)
- `PUT /api/admin/update` - Update quotation data
- `POST /api/admin/init` - Initialize database

## Calculation Logic

The calculator uses intelligent formulas based on material types:

- **Frame/Profile materials**: Based on perimeter (2 × (width + height))
- **Glass/Glazing**: Based on area (width × height)
- **Fasteners**: Fixed quantity (8 screws per window)
- **Seals/Gaskets**: Based on perimeter
- **Hardware**: Fixed quantity (1 handle, 1 lock, etc.)
- **Labor Cost**: Optional 15% of material cost

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Environment Variables

- `MONGO_DB_URL` - MongoDB connection string (required)

## Notes

- The PDF parser extracts materials and prices from the PDF structure
- Material calculation formulas can be customized per profile
- The app supports multiple profiles with different material sets
- All prices are displayed in the currency from the PDF (default: INR/₹)
- The PDF parser may need adjustment based on your specific PDF format

## Troubleshooting

### Database Connection Issues
- Verify your MongoDB connection string in `.env.local`
- Ensure your MongoDB Atlas IP whitelist includes your IP address
- Check that your database user has proper permissions

### PDF Parsing Issues
- Ensure the PDF contains structured data (not just images)
- The parser looks for price patterns (Rs, INR, ₹)
- You may need to adjust the parser logic in `lib/pdfParser.ts` for your specific PDF format

### Calculation Errors
- Verify that quotation data is loaded (check Admin Portal)
- Ensure at least one profile with materials exists
- Check that dimensions are positive numbers

## License

This project is private and proprietary.
