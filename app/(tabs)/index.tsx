import { icons } from "@/constants/icons";

import { images } from "@/constants/images";
import { fetchMovies, fetchTrendingMovies } from "@/services/api";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Image, ScrollView, Text, View } from "react-native";
import MovieCard from "../components/MovieCard";
import SearchBar from "../components/SearchBar";
import TrendingCard from "../components/TrendingCard";

export default function Index() {
  const router = useRouter();

  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError
} = useFetch(fetchTrendingMovies);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError
  } = useFetch(() => fetchMovies({
    query: ''
  }))
  
  return (
    <View className="flex-1 bg-primary">         
    <Image source={images.bg} className="absolute w-full z-0" />

    <ScrollView className="flex-1 px-5" 
    showsVerticalScrollIndicator={false} contentContainerStyle={{minHeight: "102%", paddingBottom: 10 }} >
    <Image source={icons.logo} className="w-14 h-12 mt-20 mb-5 mx-auto" />

    {moviesLoading || trendingLoading ? (
      <ActivityIndicator 
      size='large'
      color='#0000ff'
      className="mt-10 self-center"
      />
    ) : moviesError || trendingError ? ( 
      <Text>Error: {moviesError?.message || trendingError?.message} </Text>
    ) : (!trendingMovies && !movies) ? (
      <View className="flex-1 mt-5">
        <SearchBar 
          onPress={() => router.push("/search")}
          placeholder="Search for a movie"
        />
        <Text className="text-white text-center mt-10">No movies found</Text>
      </View>
    ) : (
     <View className="flex-1 mt-5">
      <SearchBar 
      onPress={() => router.push("/search")}
      placeholder="Search for a movie"
      />

        {trendingMovies && Array.isArray(trendingMovies) && trendingMovies.length > 0 && (
         <View className="mt-10">
         <Text className="text-lg text-white font-bold mb-3">Trending Movies</Text>
         
         <FlatList
           horizontal
           showsHorizontalScrollIndicator={false}
           ItemSeparatorComponent={() => 
             <View className="w-4" />
           }
           className="mb-4 mt-3"
           data={trendingMovies || []}
           renderItem={({ item, index }) => (
               <TrendingCard movie={item} index={index} />
           )}
           keyExtractor={(item, index) => (item?.id || index || 0).toString()}
         />
       </View>
)}

      {movies && Array.isArray(movies) && movies.length > 0 && (
        <>
          <Text className="text-lg text-white font-bold mt-5 mb-3">Latest Movies </Text>

          <FlatList 
            data={movies || []}
            renderItem={({item}) => (
              <MovieCard
                {...(item || {})}
              />
            )}
            keyExtractor={(item, index) => (item?.id || index || 0).toString()}
            numColumns={3}
            columnWrapperStyle={{
              justifyContent: 'flex-start',
              gap: 20,
              paddingRight: 5,
              marginBottom: 10,
            }}
            className="mt-2 pb-32"
            scrollEnabled={false}
          />
        </>
      )}
    </View>
    )
  }

    {/* <View className="flex-1 mt-5">
      <SearchBar 
      onPress={() => router.push("/search")}
      placeholder="Search for a movie"
      />
    </View> */}
    </ScrollView>
    </View>
  );
}
