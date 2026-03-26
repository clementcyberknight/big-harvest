import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useInventoryStore } from "@/store/inventory-store";
import { useFarmStore } from "@/store/farm-store";
import { CROP_GUIDE, CropType } from "@/constants/crops";

// Reusing asset map concept
const ASSET_MAP: Record<string, any> = {
  wheat: require("@/assets/image/assets_images_icons_crops_wheat.webp"),
  corn: require("@/assets/image/assets_images_icons_crops_corn.webp"),
  carrot: require("@/assets/image/assets_images_icons_crops_carrot.webp"),
  potato: require("@/assets/image/assets_images_icons_crops_potato.webp"),
  tomato: require("@/assets/image/assets_images_icons_crops_tomato.webp"),
  strawberry: require("@/assets/image/assets_images_icons_crops_strawberry.webp"),
  rice: require("@/assets/image/assets_images_icons_crops_rice.webp"),
  soybean: require("@/assets/image/assets_images_icons_crops_soybean.webp"),
  onion: require("@/assets/image/assets_images_icons_crops_onion.webp"),
  pepper: require("@/assets/image/assets_images_icons_crops_pepper.webp"),
  sunflower: require("@/assets/image/assets_images_icons_crops_sunflower.webp"),
  sugarcane: require("@/assets/image/assets_images_icons_crops_sugarcane.webp"),
  cacao: require("@/assets/image/assets_images_icons_crops_cacao.webp"),
  coffee_beans: require("@/assets/image/assets_images_icons_crops_coffee_beans.webp"),
};

interface SeedSelectorModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SeedSelectorModal = ({ visible, onClose }: SeedSelectorModalProps) => {
  const insets = useSafeAreaInsets();
  const items = useInventoryStore((state) => state.items);
  const setSelectedCropId = useFarmStore((state) => state.setSelectedCropId);

  // Filter for seeds (crops) that have quantity > 0
  const seeds = Object.values(items).filter(
    (item) => item.type === "crop" && item.quantity > 0
  );

  const handleSelect = (cropId: string) => {
    setSelectedCropId(cropId as CropType);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <Pressable style={styles.dismissArea} onPress={onClose} />
        <View style={[styles.content, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.handle} />
          
          <View style={styles.header}>
            <Text style={styles.title}>Select a Seed</Text>
            <Text style={styles.subtitle}>Pick a seed, then tap empty plots to plant</Text>
          </View>

          {seeds.length > 0 ? (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.scrollContent}
            >
              {seeds.map((seed) => (
                <Pressable 
                  key={seed.id} 
                  style={styles.seedCard}
                  onPress={() => handleSelect(seed.id)}
                >
                  <View style={styles.imageContainer}>
                    <Image
                      source={ASSET_MAP[seed.id]}
                      style={styles.seedImage}
                      contentFit="contain"
                    />
                  </View>
                  <Text style={styles.seedName}>{CROP_GUIDE[seed.id as CropType]?.name || seed.id}</Text>
                  <View style={styles.quantityBadge}>
                    <Text style={styles.quantityText}>x{seed.quantity}</Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <Text style={styles.emptyEmoji}>📭</Text>
              </View>
              <Text style={styles.emptyTitle}>Out of Seeds!</Text>
              <Text style={styles.emptySubtitle}>Visit the market to buy more seeds or wait for harvests.</Text>
              <Pressable style={styles.marketButton} onPress={onClose}>
                <Text style={styles.marketButtonText}>Got it</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  dismissArea: {
    flex: 1,
  },
  content: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    minHeight: 300,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#032018",
    fontFamily: "Space Grotesk",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
    paddingBottom: 20,
  },
  seedCard: {
    width: 120,
    height: 160,
    backgroundColor: "#DAF8B7",
    borderRadius: 24,
    padding: 12,
    alignItems: "center",
    justifyContent: "space-between",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
  },
  seedImage: {
    width: 60,
    height: 60,
  },
  seedName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#032018",
    marginBottom: 8,
  },
  quantityBadge: {
    backgroundColor: "#032018",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  quantityText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  emptyContainer: {
    alignItems: "center",
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyEmoji: {
    fontSize: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#032018",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  marketButton: {
    backgroundColor: "#032018",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 16,
  },
  marketButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
});
