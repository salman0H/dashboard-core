import { Handle, Position, NodeProps } from '@xyflow/react';

interface CustomNodeData {
  label: string;
  description?: string;
  executionProcess?: string;
}

// Shared helper to determine handle positions with fallback
const getTargetPos = (props: NodeProps<CustomNodeData>): Position =>
  props.targetPosition ?? Position.Top;
const getSourcePos = (props: NodeProps<CustomNodeData>): Position =>
  props.sourcePosition ?? Position.Bottom;

export const StartEndNode = (props: NodeProps<CustomNodeData>) => {
  const { data, isConnectable } = props;
  const long = (data.label?.length ?? 0) > 20;
  return (
    <div className="relative flex flex-col items-center">
      <Handle
        type="target"
        position={getTargetPos(props)}
        isConnectable={isConnectable}
        className="w-3 h-3"
      />
      <div
        className="flex items-center justify-center border-blue-500 border-2 text-black px-4 py-2 font-bold"
        style={{
          borderRadius: '50%',
          minWidth: '120px',
          height: 'auto',
          minHeight: '60px'
        }}
      >
        <div
          className={`text-center text-sm p-2 ${
            long ? 'break-words whitespace-normal' : 'whitespace-nowrap'
          } max-w-[200px]`}
        >
          {data.label || 'Start/End'}
        </div>
      </div>
      <Handle
        type="source"
        position={getSourcePos(props)}
        isConnectable={isConnectable}
        className="w-3 h-3"
      />
    </div>
  );
};

export const ProcessNode = (props: NodeProps<CustomNodeData>) => {
  const { data, isConnectable } = props;
  const long = (data.label?.length ?? 0) > 20;
  return (
    <div className="relative flex flex-col items-center">
      <Handle
        type="target"
        position={getTargetPos(props)}
        isConnectable={isConnectable}
        className="w-3 h-3"
      />
      <div
        className="flex items-center justify-center border-green-500 border-2 text-black px-6 py-3 font-bold"
        style={{
          transform: 'skew(-20deg)',
          minWidth: '140px',
          width: 'auto',
          height: 'auto'
        }}
      >
        <div
          className={`text-center text-sm p-2 ${
            long ? 'break-words whitespace-normal' : 'whitespace-nowrap'
          } max-w-[200px]`}
          style={{ transform: 'skew(20deg)' }}
        >
          {data.label || 'Process'}
        </div>
      </div>
      <Handle
        type="source"
        position={getSourcePos(props)}
        isConnectable={isConnectable}
        className="w-3 h-3"
      />
    </div>
  );
};

export const InputOutputNode = (props: NodeProps<CustomNodeData>) => {
  const { data, isConnectable } = props;
  const long = (data.label?.length ?? 0) > 20;
  return (
    <div className="relative flex flex-col items-center">
      <Handle
        type="target"
        position={getTargetPos(props)}
        isConnectable={isConnectable}
        className="w-3 h-3"
      />
      <div
        className="flex items-center justify-center border-purple-500 border-2 text-black px-6 py-3 font-bold"
        style={{
          transform: 'skew(-20deg)',
          minWidth: '140px',
          width: 'auto',
          height: 'auto'
        }}
      >
        <div
          className={`text-center text-sm p-2 ${
            long ? 'break-words whitespace-normal' : 'whitespace-nowrap'
          } max-w-[200px]`}
          style={{ transform: 'skew(20deg)' }}
        >
          {data.label || 'Input/Output'}
        </div>
      </div>
      <Handle
        type="source"
        position={getSourcePos(props)}
        isConnectable={isConnectable}
        className="w-3 h-3"
      />
    </div>
  );
};

export const DecisionNode = (props: NodeProps<CustomNodeData>) => {
  const { data, isConnectable } = props;
  const long = (data.label?.length ?? 0) > 20;
  return (
    <div className="relative flex flex-col items-center">
      <Handle
        type="target"
        position={getTargetPos(props)}
        isConnectable={isConnectable}
        className="w-3 h-3"
      />
      <div
        className="flex items-center justify-center border-yellow-500 border-2 text-black font-bold"
        style={{
          transform: 'rotate(45deg)',
          width: long ? '120px' : '80px',
          height: long ? '120px' : '80px'
        }}
      >
        <div
          className={`text-center text-sm p-2 ${
            long ? 'break-words whitespace-normal' : 'whitespace-nowrap'
          } max-w-[100px]`}
          style={{ transform: 'rotate(-45deg)' }}
        >
          {data.label || 'Decision'}
        </div>
      </div>
      <Handle
        type="source"
        position={getSourcePos(props)}
        isConnectable={isConnectable}
        className="w-3 h-3"
      />
    </div>
  );
};

export const nodeTypes = {
  start: StartEndNode,
  process: ProcessNode,
  input: InputOutputNode,
  decision: DecisionNode,
};