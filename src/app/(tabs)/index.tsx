import { Image } from "expo-image";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CraftingGrid } from "@/components/crafting-grid";
import { FarmGrid } from "@/components/farm-grid";
import { InventoryModal } from "@/components/inventory-modal";
import { MarketModal } from "@/components/market-modal";
import { RanchGrid } from "@/components/ranch-grid";
import { SeedSelectorModal } from "@/components/seed-selector-modal";
import { SubTabs } from "@/components/sub-tabs";
import { ThemedView } from "@/components/themed-view";
import { BottomTabInset } from "@/constants/theme";
import { useFarmStore } from "@/store/farm-store";
import { useInventoryStore } from "@/store/inventory-store";

const inventoryIcon = require("@/assets/image/assets_images_icons_misc_box.webp");
const marketIcon = require("@/assets/image/assets_images_icons_misc_market.webp");
const seedIcon = require("@/assets/image/assets_images_icons_misc_emoji_wheat.webp");

const cropAssets: Record<string, any> = {
  wheat: require("@/assets/image/assets_images_icons_crops_wheat.webp"),
  corn: require("@/assets/image/assets_images_icons_crops_corn.webp"),
  carrot: require("@/assets/image/assets_images_icons_crops_carrot.webp"),
};

const farmIcon = require("@/assets/inapp-icons/home-tab-icons/Vegetable-Rosemary--Streamline-Ultimate.png");
const ranchIcon = require("@/assets/inapp-icons/home-tab-icons/Range-Cow-1--Streamline-Ultimate.png");
const craftIcon = require("@/assets/inapp-icons/home-tab-icons/Making-Slime-1--Streamline-Ultimate.png");

type HomeTabType = "farm" | "ranch" | "craft";

const HOME_TABS = [
  { id: "farm", icon: farmIcon },
  { id: "ranch", icon: ranchIcon },
  { id: "craft", icon: craftIcon },
];

const TAB_LABELS: Record<HomeTabType, string> = {
  farm: "Farm",
  ranch: "Ranch",
  craft: "Craft",
};

const TAB_DESCRIPTIONS: Record<HomeTabType, string> = {
  farm: "Plant & harvest crops",
  ranch: "Raise your animals",
  craft: "Craft & process goods",
};

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<HomeTabType>("farm");
  const [inventoryVisible, setInventoryVisible] = useState(false);
  const [marketVisible, setMarketVisible] = useState(false);
  const [seedSelectorVisible, setSeedSelectorVisible] = useState(false);

  const selectedCropId = useFarmStore((state) => state.selectedCropId);

  const totalItems = useInventoryStore((state) =>
    Object.values(state.items).reduce((acc, item) => acc + item.quantity, 0),
  );
  const selectedCropQuantity = useInventoryStore(
    (state) => state.items[selectedCropId]?.quantity || 0,
  );

  // Ready-to-harvest count for the status strip
  const readyCount = useFarmStore(
    (state) =>
      Object.values(state.plots).filter((p) => p.status === "ready").length,
  );
  const plantedCount = useFarmStore(
    (state) =>
      Object.values(state.plots).filter((p) => p.status === "planted").length,
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["left", "right"]}>
        {/* ── TAB NAVIGATION ── */}
        <SubTabs
          tabs={HOME_TABS}
          activeTabId={activeTab}
          onTabPress={(id) => setActiveTab(id as HomeTabType)}
        />

        {/* ── TAB CONTEXT STRIP ── */}
        <View style={styles.contextStrip}>
          <View>
            <Text style={styles.contextTitle}>{TAB_LABELS[activeTab]}</Text>
            <Text style={styles.contextSub}>{TAB_DESCRIPTIONS[activeTab]}</Text>
          </View>

          {/* Farm-specific live stats */}
          {activeTab === "farm" && (
            <View style={styles.farmStats}>
              {readyCount > 0 && (
                <View style={styles.statPill}>
                  <View
                    style={[styles.statDot, { backgroundColor: "#71B312" }]}
                  />
                  <Text style={styles.statPillText}>{readyCount} ready</Text>
                </View>
              )}
              {plantedCount > 0 && (
                <View style={styles.statPill}>
                  <View
                    style={[styles.statDot, { backgroundColor: "#FFB038" }]}
                  />
                  <Text style={styles.statPillText}>
                    {plantedCount} growing
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* ── MAIN SCROLL AREA ── */}
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === "farm" && <FarmGrid />}
          {activeTab === "ranch" && <RanchGrid />}
          {activeTab === "craft" && <CraftingGrid />}

          {/* Spacer clears FABs */}
          <View style={{ height: BottomTabInset + 120 }} />
        </ScrollView>

        {/* ── FAB: LEFT — Inventory ── */}
        <View style={styles.fabLeft}>
          <Pressable
            style={({ pressed }) => [
              styles.fab,
              styles.fabDark,
              pressed && styles.fabPressed,
            ]}
            onPress={() => setInventoryVisible(true)}
          >
            <Image
              source={inventoryIcon}
              style={styles.fabImage}
              contentFit="contain"
            />
            {totalItems > 0 && (
              <View style={styles.badgeGray}>
                <Text style={styles.badgeTextDark}>{totalItems}</Text>
              </View>
            )}
          </Pressable>
          <Text style={styles.fabLabel}>Inventory</Text>
        </View>

        {/* ── FABs: RIGHT — Seed + Market ── */}
        <View style={styles.fabRight}>
          {/* Seed Selector — primary action, larger */}
          <View style={styles.fabItem}>
            <Pressable
              style={({ pressed }) => [
                styles.fab,
                styles.fabGreen,
                styles.fabPrimary,
                pressed && styles.fabPressed,
              ]}
              onPress={() => setSeedSelectorVisible(true)}
            >
              <Image
                source={cropAssets[selectedCropId] || seedIcon}
                style={styles.fabImage}
                contentFit="contain"
              />
              <View
                style={[
                  styles.badgeRed,
                  selectedCropQuantity === 0 && styles.badgeGray,
                ]}
              >
                <Text
                  style={
                    selectedCropQuantity === 0
                      ? styles.badgeTextDark
                      : styles.badgeTextLight
                  }
                >
                  {selectedCropQuantity}
                </Text>
              </View>
            </Pressable>
            <Text
              style={[styles.fabLabel, { color: "#71B312", fontWeight: "700" }]}
            >
              Seeds
            </Text>
          </View>

          {/* Market */}
          <View style={styles.fabItem}>
            <Pressable
              style={({ pressed }) => [
                styles.fab,
                styles.fabDark,
                pressed && styles.fabPressed,
              ]}
              onPress={() => setMarketVisible(true)}
            >
              <Image
                source={marketIcon}
                style={styles.fabImage}
                contentFit="contain"
              />
            </Pressable>
            <Text style={styles.fabLabel}>Market</Text>
          </View>
        </View>
      </SafeAreaView>

      <InventoryModal
        visible={inventoryVisible}
        onClose={() => setInventoryVisible(false)}
      />
      <MarketModal
        visible={marketVisible}
        onClose={() => setMarketVisible(false)}
      />
      <SeedSelectorModal
        visible={seedSelectorVisible}
        onClose={() => setSeedSelectorVisible(false)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7F2",
  },
  safeArea: {
    flex: 1,
  },

  // ── CONTEXT STRIP
  contextStrip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(3,32,24,0.06)",
  },
  contextTitle: {
    fontSize: 17,
    fontFamily: "Space Mono",
    fontWeight: "700",
    color: "#032018",
    lineHeight: 20,
  },
  contextSub: {
    fontSize: 11,
    fontFamily: "Space Mono",
    color: "rgba(3,32,24,0.40)",
    marginTop: 2,
  },
  farmStats: {
    flexDirection: "row",
    gap: 6,
  },
  statPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#F5F7F2",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "rgba(3,32,24,0.07)",
  },
  statDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statPillText: {
    fontSize: 11,
    fontFamily: "Space Mono",
    fontWeight: "700",
    color: "#032018",
  },

  // ── SCROLL
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  // ── FABs
  fabLeft: {
    position: "absolute",
    bottom: 16,
    left: 16,
    alignItems: "center",
    gap: 5,
    zIndex: 10,
  },
  fabRight: {
    position: "absolute",
    bottom: 16,
    right: 16,
    alignItems: "center",
    gap: 10,
    zIndex: 10,
  },
  fabItem: {
    alignItems: "center",
    gap: 5,
  },
  fab: {
    width: 58,
    height: 58,
    borderRadius: 18,
    padding: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  fabPrimary: {
    width: 64,
    height: 64,
    borderRadius: 20,
    padding: 14,
  },
  fabDark: {
    backgroundColor: "#032018",
  },
  fabGreen: {
    backgroundColor: "#71B312",
  },
  fabPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  fabImage: {
    width: "100%",
    height: "100%",
  },
  fabLabel: {
    fontSize: 10,
    fontFamily: "Space Mono",
    color: "rgba(3,32,24,0.50)",
    fontWeight: "700",
  },

  // ── BADGES
  badgeRed: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#FF383C",
    borderRadius: 12,
    minWidth: 22,
    height: 22,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#F5F7F2",
  },
  badgeGray: {
    position: "absolute",
    bottom: -6,
    right: -6,
    backgroundColor: "#E2DDD6",
    borderRadius: 11,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 3,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#F5F7F2",
  },
  badgeTextLight: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
    fontFamily: "Space Mono",
  },
  badgeTextDark: {
    color: "#032018",
    fontSize: 10,
    fontWeight: "800",
    fontFamily: "Space Mono",
  },
});
