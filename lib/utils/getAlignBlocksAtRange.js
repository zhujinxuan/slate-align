// @flow
import { type Range, type Node } from 'slate';
import { isStartByKey, isEndByKey } from 'slate-bind-copy-paste';
import type Options from '../options';

function getAlignBlocksAtRange(
    opts: Options,
    range: Range,
    node: Node
): Array<Node> {
    if (range.isBackward) range = range.flip();
    const { startKey, endKey } = range;
    if (node.object !== 'block' && node.object !== 'document') return [];

    if (node.object === 'block') {
        if (node.isLeafBlock()) {
            return getAlignBlocksInBlock(opts, node);
        }
        if (isStartByKey(node, startKey) && isEndByKey(node, endKey)) {
            if (
                range.startOffset === 0 &&
                node.getDescendant(endKey).text.length === range.endOffset
            ) {
                return getAlignBlocksInBlock(opts, node);
            }
        }
    }
    const startChild = node.getFurthestAncestor(startKey);
    const endChild = node.getFurthestAncestor(endKey);
    if (!startChild || !endChild) return [];
    if (startChild === endChild) {
        if (startChild.object === 'block') {
            return getAlignBlocksAtRange(opts, range, startChild);
        }
        return getAlignBlocksInBlock(opts, node);
    }
    let result = getAlignBlocksAtRange(
        opts,
        range.moveFocusToEndOf(startChild),
        startChild
    );
    const startIndex = node.nodes.indexOf(startChild);
    const endIndex = node.nodes.indexOf(endChild);
    node.nodes.slice(startIndex + 1, endIndex).forEach(n => {
        result = result.concat(getAlignBlocksInBlock(opts, n));
    });
    return result.concat(
        getAlignBlocksAtRange(
            opts,
            range.moveAnchorToStartOf(endChild),
            endChild
        )
    );
}

function getAlignBlocksInBlock(
    opts: Options,
    node: Node,
    index: number = 0
): Array<Node> {
    if (node.object !== 'block') return [];
    const { textBlocks, floatBlocks } = opts;
    const { type } = node;
    let result =
        textBlocks.indexOf(type) === -1 && floatBlocks.indexOf(type) === -1
            ? []
            : [node];

    if (node.isLeafBlock()) {
        return result;
    }

    node.nodes.forEach(n => {
        result = result.concat(getAlignBlocksInBlock(opts, n, index + 1));
    });
    return result;
}

export default getAlignBlocksAtRange;
export { getAlignBlocksInBlock };
