# Map Locator Frontend

A React-based frontend application for interactive map exploration with point-of-interest search and polygon-based data analysis.

## Features

### 1. Point-of-Interest Search

- Add points by clicking on the map
- Search for locations using text phrases
- Configure travel modes (Car, Pedestrian, Bus)
- Set budget constraints (Distance, Time, Energy, Fuel)
- Visualize search results as colored regions

### 2. Polygon Mode (NEW)

- Create polygons by clicking points on the map
- Select data layers (1-17)
- Retrieve Morton tile data with occurrence counts
- Visualize data with color-coded tiles
- Interactive tile information on click

## Tech Stack

- **React 18** with TypeScript
- **Mapbox GL JS** for map rendering
- **Styled Components** for styling
- **Vite** for build tooling
- **TomTom API** for mapping services

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/MarcinTargonski-TomTom/map-locator-frontend.git
cd map-locator-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Configure your environment variables:

```env
VITE_TOMTOM_API_KEY=your_tomtom_api_key
VITE_API_BASE_URL=https://api.tomtom.com
```

4. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage

### Basic Search Mode

1. Navigate to `/map`
2. Click on the map to add points of interest
3. Use the search form to add text-based searches
4. Configure travel modes and budgets
5. View results in the responses tab

### Polygon Mode

1. Open the side panel and click the "Polygon" tab
2. Click "Enter Polygon Mode"
3. Click on the map to create polygon vertices
4. Select a layer (1-17) for data analysis
5. View Morton tile results on the map

For detailed polygon mode documentation, see [POLYGON_MODE.md](./POLYGON_MODE.md).

## Project Structure

```
src/
├── components/          # React components
│   ├── Map.tsx         # Main map component
│   ├── TabbedPanel.tsx # Side panel with tabs
│   ├── PolygonTab.tsx  # Polygon mode interface
│   ├── MapClickHandler.tsx # Click event handling
│   └── MortonTileDisplay.tsx # Morton tile visualization
├── context/            # React context
│   └── mapContext.ts   # Global map state
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
│   ├── apiUtils.ts     # API helpers
│   └── mortonUtils.ts  # Morton code utilities
└── main.tsx           # Application entry point
```

## API Integration

### Point-of-Interest Search

The application integrates with backend APIs for POI search functionality.

### Polygon Mode API

Send polygon data to TomTom locations API:

**Endpoint:** `POST /locations/v1/stats`

**Request:**

```json
{
  "bounds": [
    { "latitude": 51.16558, "longitude": 19.89657 },
    { "latitude": 51.78769, "longitude": 19.44424 }
  ],
  "layer": 17
}
```

**Response:**

```json
[
  { "mortonCode": 15087420567, "occurrences": 1 },
  { "mortonCode": 15087420573, "occurrences": 2 }
]
```

## Development

### Build for Production

```bash
npm run build
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
