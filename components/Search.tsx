import icons from "@/constants/icons";
import { useLocalSearchParams, usePathname } from "expo-router";
import React, { useState } from "react";
import { Image, TextInput, TouchableOpacity, View } from "react-native";

interface SearchProps {
  placeholder: string;
}
const Search = ({ placeholder }: SearchProps) => {
  const pathname = usePathname();
  const params = useLocalSearchParams<{
    query?: string;
  }>();
  const [search, setSearch] = useState<string>("");

  const handleSearch = (text: string) => {
    setSearch(text);
  };
  return (
    <View className="flex flex-row items-center justify-between w-full px-4 rounded-lg bg-accent-100 border border-primary-100 mt-5 py-2 ">
      <View className="flex flex-1 flex-row items-center justify-center z-50">
        <Image source={icons.search} className="size-5" />
        <TextInput
          value={search}
          onChangeText={handleSearch}
          placeholder={placeholder}
          className="text-sm font-rubik ml-2 flex-1 placeholder:text-black-100"
        />
      </View>
      <TouchableOpacity>
        <Image source={icons.filter} className="size-5" />
      </TouchableOpacity>
    </View>
  );
};

export default Search;
