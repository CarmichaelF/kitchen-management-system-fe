import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

interface Product {
  _id: string;
  name: string;
  ingredients: {
    inventory: {
      id: string;
    };
    unity: string;
    quantity: number;
    name: string;
  }[];
  pricing?: {
    productionCost: number;
    profitMargin: number;
    sellingPrice: number;
    yields: number;
  };
}

interface PDFProductProps {
  product: Product;
}

const styles = StyleSheet.create({
  table: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "50%",
    borderStyle: "solid",
    borderWidth: 1,
    backgroundColor: "#eee",
    padding: 4,
  },
  tableCol: {
    width: "50%",
    borderStyle: "solid",
    borderWidth: 1,
    padding: 4,
  },
  tableHeaderText: {
    fontWeight: 700,
    fontSize: 14,
  },
  tableCell: {
    fontSize: 12,
  },
  page: {
    flexDirection: "row",
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: "20px",
  },
  pricingBox: {
    border: "1px solid #333",
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
    backgroundColor: "#f5f5f5",
    marginTop: 8,
  },
  pricingRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 4,
  },
  pricingLabel: {
    fontWeight: 700,
    fontSize: 13,
  },
  pricingValue: {
    fontSize: 13,
    fontWeight: 500,
  },
  price: {
    fontSize: 12,
  },
  yield: {
    fontSize: 12,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: 500,
    border: "1px solid #000",
  },
  ingredients: {
    display: "flex",
  },
  unit: {
    fontSize: 16,
    fontWeight: 600,
  },
});

export const PDFDocument = ({
  product: { ingredients, name, pricing },
}: PDFProductProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>{`Ingredientes - ${name}`}</Text>
        {pricing && (
          <View style={styles.pricingBox}>
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Custo de produção:</Text>
              <Text style={styles.pricingValue}>
                R$ {pricing.productionCost}
              </Text>
            </View>
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Preço de venda:</Text>
              <Text style={styles.pricingValue}>R$ {pricing.sellingPrice}</Text>
            </View>
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Rendimento:</Text>
              <Text style={styles.pricingValue}>{pricing.yields}</Text>
            </View>
          </View>
        )}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableHeaderText}>Ingrediente</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableHeaderText}>Quantidade (Unidade)</Text>
            </View>
          </View>
          {ingredients?.map((ingredient) => (
            <View style={styles.tableRow} key={ingredient.name}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{ingredient.name}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {ingredient.quantity} ({ingredient.unity})
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);
