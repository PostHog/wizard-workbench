# Mini REST Countries Explorer

A cool, interactive web application that lets you explore country data using the new **React Router V7** framework. This project fetches data from the [REST Countries API](https://restcountries.com) and allows you to filter and view detailed information about countries, including their names, capitals, regions, populations, and flags.

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Dynamic Routing:** Leverages React Router V7 to handle multiple routes and dynamic URL parameters.
- **Data Fetching:** Uses route loaders to retrieve country data from the REST Countries API.
- **Search & Filter:** Users can search for countries by name and filter by region.
- **Responsive UI:** Styled with Tailwind CSS to create a modern, responsive interface.
- **Modular Code:** Organized into reusable components for easy scaling and maintenance.

## Demo

_Link to Demo:_  
[Live Demo](#)  
_(Replace `#` with your live demo link when available)_

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/mini-rest-countries-explorer.git
   cd mini-rest-countries-explorer
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser and navigate to:**

   ```
   http://localhost:5173
   ```

## Usage

- **Home Page:** Get an introduction to the project with a hero section that explains the purpose of the explorer.
- **Countries Page:** View a list of all countries. Use the search input to filter by name and select a region from the dropdown to narrow down your results.
- **Country Detail Page:** Click on any country from the list to see detailed information, including a country flag, official name, capital, region, subregion, and population.
- **About Page:** Learn more about how the app uses the REST Countries API to display data and the technologies powering the project.

## Project Structure

```
mini-rest-countries-explorer/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src
    ├── main.tsx
    └── app
        ├── root.tsx        # Root layout with Header and Outlet
        ├── routes.ts       # Routes configuration
        ├── routes
        │   ├── home.tsx    # Home page component
        │   ├── countries.tsx  # Countries list page with search & filtering
        │   ├── country.tsx    # Country detail page
        │   └── about.tsx   # About page explaining the project
        └── components
            └── Header.tsx  # Shared header component with navigation
```

## Technologies Used

- **React:** JavaScript library for building user interfaces.
- **React Router V7:** For handling routing and navigation in our React application.
- **TypeScript:** Provides static typing for a more robust and maintainable codebase.
- **Tailwind CSS:** Utility-first CSS framework for styling.
- **Vite:** Fast development server and build tool.

## Contributing

Contributions are welcome! If you have any suggestions or improvements, please feel free to submit a pull request or open an issue.

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature/YourFeature`).
6. Open a pull request.

---

Happy coding and enjoy exploring the world with your Mini REST Countries Explorer!
