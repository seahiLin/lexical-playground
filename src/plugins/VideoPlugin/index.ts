/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$insertNodeToNearestRoot} from '@lexical/utils';
import {COMMAND_PRIORITY_EDITOR, createCommand, LexicalCommand} from 'lexical';
import {useEffect} from 'react';

import {$createVideoNode, VideoNode} from '../../nodes/VideoNode';

export const INSERT_VIDEO_COMMAND: LexicalCommand<{
  url: string;
  width?: number;
  height?: number;
}> = createCommand(
  'INSERT_VIDEO_COMMAND',
);

export default function VideoPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([VideoNode])) {
      throw new Error('VideoPlugin: VideoNode not registered on editor');
    }

    return editor.registerCommand<{
      url: string;
      width?: number;
      height?: number;
    }>(
      INSERT_VIDEO_COMMAND,
      (payload) => {
        const VideoNode = $createVideoNode(payload.url, payload.width, payload.height);
        $insertNodeToNearestRoot(VideoNode);

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}
