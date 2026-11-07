import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../../../../styled/theme.styled';

interface PolicyContentRendererProps {
  content?: string;
}

export const PolicyContentRenderer: React.FC<PolicyContentRendererProps> = ({ content }) => {
  if (!content) return null;

  // Split by line breaks, but also expand inline bullet points (•) if any
  const rawLines = content.split(/\r?\n/);
  const lines: string[] = [];
  rawLines.forEach(l => {
    if (l.includes('•') && !l.trim().startsWith('•')) {
      const parts = l.split('•');
      if (parts[0].trim()) lines.push(parts[0].trim());
      for (let i = 1; i < parts.length; i++) {
        if (parts[i].trim()) lines.push(`• ${parts[i].trim()}`);
      }
    } else {
      lines.push(l);
    }
  });

  return (
    <View style={styles.container}>
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <View key={index} style={styles.spacer} />;
        }

        // Check if line is a major section heading (e.g., "1. Purpose", "12.1 Processing and Hosting")
        const isNumberedHeading = /^\d+(\.\d+)*\.\s+/.test(trimmed);
        const isAllCapsHeading = trimmed.length > 3 && trimmed.length < 40 && trimmed === trimmed.toUpperCase() && !trimmed.includes(':');

        if (isNumberedHeading || isAllCapsHeading) {
          return (
            <View key={index} style={styles.headingContainer}>
              <Text style={styles.headingText}>{trimmed}</Text>
            </View>
          );
        }

        // Bullet point lines
        const isBullet = trimmed.startsWith('-') || trimmed.startsWith('•');
        if (isBullet) {
          return (
            <View key={index} style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>{trimmed.replace(/^[-•]\s*/, '')}</Text>
            </View>
          );
        }

        // Numbered list item inside a clause (e.g., "1. The patient and...")
        const isNumberedSubItem = /^\d+\.\s+/.test(trimmed);
        if (isNumberedSubItem) {
          return (
            <View key={index} style={styles.numberedRow}>
              <Text style={styles.paragraphText}>{trimmed}</Text>
            </View>
          );
        }

        // Key-value metadata line (e.g. "Legal Entity: PRED Solutions", "Email: info@predcare.in")
        const isKeyValue = /^[A-Za-z\s\/]+:\s+[^\s]/.test(trimmed) && trimmed.length < 90;
        if (isKeyValue) {
          const colonIdx = trimmed.indexOf(':');
          const keyPart = trimmed.substring(0, colonIdx + 1);
          const valPart = trimmed.substring(colonIdx + 1);
          return (
            <View key={index} style={styles.kvRow}>
              <Text style={styles.kvKey}>{keyPart}</Text>
              <Text style={styles.kvVal}>{valPart}</Text>
            </View>
          );
        }

        return (
          <Text key={index} style={styles.paragraphText}>
            {trimmed}
          </Text>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  spacer: {
    height: 10,
  },
  headingContainer: {
    marginTop: 14,
    marginBottom: 4,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
    paddingLeft: 8,
  },
  headingText: {
    fontSize: 14,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.dark,
    lineHeight: 20,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 8,
    gap: 8,
    marginTop: 2,
    marginBottom: 2,
  },
  bulletDot: {
    fontSize: 16,
    lineHeight: 20,
    color: theme.colors.primary,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.text334155,
    lineHeight: 20,
    fontWeight: theme.fontWeight.regular,
  },
  numberedRow: {
    paddingLeft: 6,
    marginVertical: 2,
  },
  kvRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 2,
  },
  kvKey: {
    fontSize: 13,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textSlate,
  },
  kvVal: {
    fontSize: 13,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.dark,
  },
  paragraphText: {
    fontSize: 13,
    color: theme.colors.text334155,
    lineHeight: 21,
    fontWeight: theme.fontWeight.regular,
  },
});

export default PolicyContentRenderer;
