import {
  agentData,
  propertyData,
  reviewerNames,
  reviewTexts,
} from "@/constants/data";
import { ID } from "react-native-appwrite";
import { config, databases } from "./appwrite";
import {
  agentImages,
  galleryImages,
  propertiesImages,
  reviewImages,
} from "./data";

const COLLECTIONS = {
  AGENT: config.agentsCollectionId,
  REVIEWS: config.reviewsCollectionId,
  GALLERY: config.galleriesCollectionId,
  PROPERTY: config.propertiesCollectionId,
};

// const propertyTypes = [
//   "House",
//   "Townhome",
//   "Condo",
//   "Duplex",
//   "Studio",
//   "Villa",
//   "Apartment",
//   "Others",
// ];

const facilities = [
  "Laundry",
  "Cutlery",
  "Gym",
  "Wifi",
  "Pet-Center",
  "Sports-Center",
  "Car-Parking",
  "Swimming-Pool",
];

// function getRandomSubset<T>(
//   array: T[],
//   minItems: number,
//   maxItems: number
// ): T[] {
//   if (minItems > maxItems) {
//     throw new Error("minItems cannot be greater than maxItems");
//   }
//   if (minItems < 0 || maxItems > array.length) {
//     throw new Error(
//       "minItems or maxItems are out of valid range for the array"
//     );
//   }

//   // Generate a random size for the subset within the range [minItems, maxItems]
//   const subsetSize =
//     Math.floor(Math.random() * (maxItems - minItems + 1)) + minItems;

//   // Create a copy of the array to avoid modifying the original
//   const arrayCopy = [...array];

//   // Shuffle the array copy using Fisher-Yates algorithm
//   for (let i = arrayCopy.length - 1; i > 0; i--) {
//     const randomIndex = Math.floor(Math.random() * (i + 1));
//     [arrayCopy[i], arrayCopy[randomIndex]] = [
//       arrayCopy[randomIndex],
//       arrayCopy[i],
//     ];
//   }

//   // Return the first `subsetSize` elements of the shuffled array
//   return arrayCopy.slice(0, subsetSize);
// }

async function seed() {
  try {
    // Clear existing data from all collections
    for (const key in COLLECTIONS) {
      const collectionId = COLLECTIONS[key as keyof typeof COLLECTIONS];
      const documents = await databases.listDocuments(
        config.databaseId!,
        collectionId!
      );
      for (const doc of documents.documents) {
        await databases.deleteDocument(
          config.databaseId!,
          collectionId!,
          doc.$id
        );
      }
    }

    console.log("Cleared all existing data.");

    // Seed Agents
    const agents = [];
    for (let i = 1; i < agentData.length; i++) {
      const agent = await databases.createDocument(
        config.databaseId!,
        COLLECTIONS.AGENT!,
        ID.unique(),
        {
          name: agentData[i].name,
          email: agentData[i].email,
          avatar: agentImages[i % agentImages.length],
        }
      );
      agents.push(agent);
    }
    console.log(`Seeded ${agents.length} agents.`);

    const properties = [];
    // Seed Properties
    for (let i = 1; i < propertyData.length; i++) {
      const data = propertyData[i];

      const assignedAgent = agents[Math.floor(Math.random() * agents.length)];

      // const assignedReviews = getRandomSubset(reviews, 5, 7); // 5 to 7 reviews
      // const assignedGalleries = getRandomSubset(galleries, 3, 8); // 3 to 8 galleries

      const selectedFacilities = facilities
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * facilities.length) + 1);

      const image =
        propertiesImages.length - 1 >= i
          ? propertiesImages[i]
          : propertiesImages[
              Math.floor(Math.random() * propertiesImages.length)
            ];

      const propertyy = await databases.createDocument(
        config.databaseId!,
        COLLECTIONS.PROPERTY!,
        ID.unique(),
        {
          name: data.name,
          type: data.type,
          description: data.description,
          address: data.address,
          geolocation: `${(Math.random() * 180 - 90).toFixed(6)}, ${(
            Math.random() * 360 -
            180
          ).toFixed(6)}`, // Random lat/long
          price: data.price,
          area: data.area,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          rating: Math.floor(Math.random() * 3) + 3, // Rating between 3-5
          facilities: selectedFacilities,
          image: image,
          agent: assignedAgent.$id,
        }
      );

      properties.push(propertyy);
      console.log(`Seeded property: ${propertyy.name}`);
    }

    // Seed Reviews
    for (let i = 1; i <= 20; i++) {
      const randomProperty =
        properties[Math.floor(Math.random() * properties.length)];
      const reviewText =
        reviewTexts[Math.floor(Math.random() * reviewTexts.length)];
      const reviewerName = reviewerNames[i % reviewerNames.length];
      const review = await databases.createDocument(
        config.databaseId!,
        COLLECTIONS.REVIEWS!,
        ID.unique(),
        {
          name: reviewerName,
          avatar: reviewImages[Math.floor(Math.random() * reviewImages.length)],
          review: reviewText,
          rating: Math.floor(Math.random() * 3) + 3, // Rating between 3-5 (mostly positive)
          property: randomProperty.$id,
        }
      );
      console.log(`Seeded review: ${review.name}`);
    }

    // Seed Galleries and link them to properties
    let galleryCount = 0;
    for (const property of properties) {
      const numGalleries = Math.floor(Math.random() * 6) + 3; // 3 to 8 images per property

      for (let i = 0; i < numGalleries; i++) {
        const image =
          galleryImages[Math.floor(Math.random() * galleryImages.length)];

        await databases.createDocument(
          config.databaseId!,
          COLLECTIONS.GALLERY!,
          ID.unique(),
          {
            image,
            property: property.$id, // Link gallery to property
          }
        );
        galleryCount++;
      }
    }

    console.log(`Seeded ${galleryCount} galleries.`);

    console.log("Data seeding completed.");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

export default seed;
