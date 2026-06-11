# Urban Ecology and Immigration: The Heat Island Effect

Static interactive website for the CCP computer science component.

## What is included

- Tabbed poster sections matching the CCP product categories
- A generated hero image stored locally in `assets/`
- A vanilla JavaScript explorer using the eight-city dataset from the planning document
- No build step and no external dependencies

## Run locally

Open `index.html` in a browser, or serve the folder with:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish with GitHub Pages

1. Push these files to the `main` branch.
2. Open the repository on GitHub.
3. Go to **Settings > Pages**.
4. Set **Source** to **Deploy from a branch**.
5. Choose branch `main` and folder `/root`.
6. Save. GitHub will provide the live site URL after deployment.

## Data shown

The chart compares UHI anomaly, tree-canopy coverage, respiratory burden, and linguistic isolation for New York, Newark, Houston, Chicago, Detroit, Phoenix, Baltimore, and Atlanta.
