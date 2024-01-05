/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  ElementFormatType,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  Spread,
} from "lexical";

import { BlockWithAlignableContents } from "@lexical/react/LexicalBlockWithAlignableContents";
import {
  DecoratorBlockNode,
  SerializedDecoratorBlockNode,
} from "@lexical/react/LexicalDecoratorBlockNode";

type VideoComponentProps = Readonly<{
  className: Readonly<{
    base: string;
    focus: string;
  }>;
  format: ElementFormatType | null;
  nodeKey: NodeKey;
  videoSrc: string;
  width?: number;
  height?: number;
}>;

function VideoComponent({
  className,
  format,
  nodeKey,
  videoSrc,
  width,
  height,
}: VideoComponentProps) {
  return (
    <BlockWithAlignableContents
      className={className}
      format={format}
      nodeKey={nodeKey}
    >
      <video src={videoSrc} controls width={width} height={height} />
    </BlockWithAlignableContents>
  );
}

export type SerializedVideoNode = Spread<
  {
    videoSrc: string;
    width?: number;
    height?: number;
  },
  SerializedDecoratorBlockNode
>;

function convertVideoElement(
  domNode: HTMLElement
): null | DOMConversionOutput {
  const videoSrc = domNode.getAttribute("data-lexical-Video");
  if (videoSrc) {
    const node = $createVideoNode(videoSrc);
    return { node };
  }
  return null;
}

export class VideoNode extends DecoratorBlockNode {
  __src: string;
  __width: number;
  __height: number;

  static getType(): string {
    return "Video";
  }

  static clone(node: VideoNode): VideoNode {
    return new VideoNode(node.__src, node.__format, node.__key, node.__width, node.__height);
  }

  static importJSON(serializedNode: SerializedVideoNode): VideoNode {
    const node = $createVideoNode(serializedNode.videoSrc);
    node.setFormat(serializedNode.format);
    return node;
  }

  exportJSON(): SerializedVideoNode {
    return {
      ...super.exportJSON(),
      type: "Video",
      version: 1,
      videoSrc: this.__src,
      width: this.__width,
      height: this.__height,
    };
  }

  constructor(src: string, format?: ElementFormatType, key?: NodeKey, width?: number, height?: number) {
    super(format, key);
    this.__src = src;
    this.__width = width || 560;
    this.__height = height || 315;
  }

  setWidthAndHeight(
    width: number,
    height: number,
  ): void {
    const writable = this.getWritable();
    writable.__width = width;
    writable.__height = height;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("video");
    element.setAttribute("data-lexical-Video", this.__src);
    // element.setAttribute("width", "560");
    // element.setAttribute("height", "315");
    element.setAttribute(
      "src",
      this.__src
    );
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      video: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute("data-lexical-Video")) {
          return null;
        }
        return {
          conversion: convertVideoElement,
          priority: 1,
        };
      },
    };
  }

  updateDOM(): false {
    return false;
  }

  getId(): string {
    return this.__src;
  }

  getTextContent(
    _includeInert?: boolean | undefined,
    _includeDirectionless?: false | undefined
  ): string {
    return this.__src;
  }

  decorate(_editor: LexicalEditor, config: EditorConfig): JSX.Element {
    const embedBlockTheme = config.theme.embedBlock || {};
    const className = {
      base: embedBlockTheme.base || "",
      focus: embedBlockTheme.focus || "",
    };
    return (
      <VideoComponent
        className={className}
        format={this.__format}
        nodeKey={this.getKey()}
        videoSrc={this.__src}
        width={this.__width}
        height={this.__height}
      />
    );
  }
}

export function $createVideoNode(videoSrc: string, width?: number, height?: number): VideoNode {
  return new VideoNode(videoSrc, undefined, undefined, width, height);
}

export function $isVideoNode(
  node: VideoNode | LexicalNode | null | undefined
): node is VideoNode {
  return node instanceof VideoNode;
}
