import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FarmGrid } from "@/components/farm-grid";
import { HomeSubTabs, HomeTabType } from "@/components/home-sub-tabs";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BottomTabInset } from "@/constants/theme";

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<HomeTabType>("farm");

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["left", "right"]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Actions Row: Bonus + Boost (Mocking the UI from the screenshot) */}
          <View style={styles.topActionsRow}>
            <View style={[styles.actionBadge, styles.bonusBadge]}>
              <ThemedText style={styles.actionTextBonus}>Bonus +15%</ThemedText>
            </View>
            <View style={styles.actionBadge}>
              <ThemedText style={styles.actionText}>Boost</ThemedText>
            </View>
          </View>

          {/* Sub Navigation Tabs */}
          <HomeSubTabs activeTab={activeTab} onChangeTab={setActiveTab} />

          {/* Tab Content */}
          {activeTab === "farm" && <FarmGrid />}
          {activeTab === "ranch" && (
            <View style={styles.comingSoon}>
              <ThemedText>Ranch coming soon...</ThemedText>
            </View>
          )}
          {activeTab === "craft" && (
            <View style={styles.comingSoon}>
              <ThemedText>Crafting coming soon...</ThemedText>
            </View>
          )}
          {activeTab === "upgrade" && (
            <View style={styles.comingSoon}>
              <ThemedText>Upgrades coming soon...</ThemedText>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: BottomTabInset + 20,
  },
  topActionsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 8,
  },
  actionBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#EFEFEF",
    gap: 6,
  },
  bonusBadge: {
    backgroundColor: "#F3E5F5",
    borderColor: "#E1BEE7",
  },
  actionText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#555",
  },
  actionTextBonus: {
    fontSize: 14,
    fontWeight: "700",
    color: "#8E24AA",
  },
  comingSoon: {
    padding: 32,
    alignItems: "center",
  },
});
