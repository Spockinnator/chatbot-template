// src/init.ts
// Vanilla JS initialization

import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { ChatbotWidget } from './components/ChatbotWidget.js';
import type { VanillaInitConfig } from './types.js';

let root: Root | null = null;

/**
 * Initialize chatbot widget (vanilla JS)
 */
function init(config: VanillaInitConfig): void {
  const { container = document.body, ...props } = config;

  // Get container element
  const containerEl = typeof container === 'string'
    ? document.querySelector(container)
    : container;

  if (!containerEl) {
    console.error('[AsterMindChatbot] Container not found:', container);
    return;
  }

  // Create mount point
  const mountPoint = document.createElement('div');
  mountPoint.id = 'astermind-chatbot-root';
  containerEl.appendChild(mountPoint);

  // Create React root and render
  root = createRoot(mountPoint);
  root.render(React.createElement(ChatbotWidget, props));

  console.log('[AsterMindChatbot] Initialized');
}

/**
 * Destroy chatbot widget
 */
function destroy(): void {
  if (root) {
    root.unmount();
    root = null;
  }

  const mountPoint = document.getElementById('astermind-chatbot-root');
  if (mountPoint) {
    mountPoint.remove();
  }

  console.log('[AsterMindChatbot] Destroyed');
}

// Export for IIFE bundle
export { init, destroy };

// Attach to window for vanilla JS usage
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).AsterMindChatbot = {
    init,
    destroy
  };
}
