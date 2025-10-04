import RectangleNode from './RectangleNode';
import CircleNode from './CircleNode';
import DiamondNode from './DiamondNode';
import TextNode from './TextNode';
import StickyNoteNode from './StickyNoteNode';
import ActorNode from './ActorNode';
import UsecaseNode from './UsecaseNode';

export const nodeTypes = {
  rectangle: RectangleNode,
  circle: CircleNode,
  diamond: DiamondNode,
  text: TextNode,
  'sticky-note': StickyNoteNode,
  actor: ActorNode,
  usecase: UsecaseNode,
};

export { 
  RectangleNode, 
  CircleNode, 
  DiamondNode,
  TextNode,
  StickyNoteNode,
  ActorNode,
  UsecaseNode,
};


