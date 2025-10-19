import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const PropertyDetailsPage = () => {
  const { id } = useLocalSearchParams();
  return (
    <View>
      <Text>PropertyDetailsPage - {id}</Text>
    </View>
  );
};

export default PropertyDetailsPage;
