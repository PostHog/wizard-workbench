class SupplierMapError extends Error {
  name = "SupplierMapError";
}

const tileSets: Record<string, string[]> = {
  north: ["n-1", "n-2", "n-3"],
  south: ["s-1", "s-2"],
};

export function SupplierMap({ zone }: { zone: string }) {
  const tiles = tileSets[zone];
  if (!tiles) {
    throw new SupplierMapError(`Supplier map has no tiles for zone ${zone} (MP14)`);
  }
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {tiles.map((tile) => (
        <div key={tile} style={{ width: 80, height: 80, background: "#d9e2ec" }}>{tile}</div>
      ))}
    </div>
  );
}
