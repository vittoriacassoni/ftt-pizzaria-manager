import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { Ionicons } from "@expo/vector-icons";
// import { createAppContainer } from "react-navigation";
// import { createMaterialTopTabNavigator } from "react-navigation-tabs";
  
import ProductPage from "./pages/Product";
import CategoryPage from "./pages/Category";
import SalePage from "./pages/Sale";
  
// const TabNavigator = createMaterialTopTabNavigator(
//   {
//     Produto: {
//       screen: ProductPage,
//       navigationOptions: {
//         tabBarLabel: "Produto",
//       },
//     },
//     Vendas: {
//       screen: SalePage,
//       navigationOptions: {
//         tabBarLabel: "Vendas",
//       },
//     },
//     Categoria: {
//       screen: CategoryPage,
//       navigationOptions: {
//         tabBarLabel: "Categoria",
//       },
//     },
//   },
//   {
//     tabBarOptions: {
//       showIcon: false,
  
//       style: {
//         backgroundColor: "#004D00",
//         marginTop: 28,
//       },
//     },
//   }
// );
  
// const Navigator = createAppContainer(TabNavigator);
  

export default function App() {
  return (
    
      <ProductPage />

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
