import { useId, useState } from 'react';
import explainService from '../services/explainService';
import { useContract } from '../context/ContractContext';
import { AbiFunction } from '../types/contract';

export default function AiExplain({ fnInfo }: { fnInfo: AbiFunction }) {
  const { contractSource, activeAiPanel, setActiveAiPanel } = useContract();
  const panelId = useId();
  const showAiExplain = activeAiPanel === panelId;
  const [explanation, setExplanation] = useState<{
    summary: string;
    inputs: { name: string; description: string }[];
    outputs: { description: string }[];
    warnings: string[];
  } | null>(null);

  const toggleExplainPanel = async () => {
    if (showAiExplain) {
      setActiveAiPanel(null);
      return;
    }
    setActiveAiPanel(panelId);

    if (explanation) return; // already have explanation

    try {
      const exp = await explainService.explainFunction(
        contractSource!,
        JSON.stringify(fnInfo),
      );
      setExplanation(exp);
    } catch (err) {
      setExplanation(null);
    }
  };

  return (
    <div className="ai-explain-wrapper">
      <button
        type="button"
        className={`ai-explain-toggle ${showAiExplain ? 'active' : ''}`}
        onClick={event => {
          event.stopPropagation();
          toggleExplainPanel();
        }}
        title="AI Explain"
        aria-expanded={showAiExplain}
        aria-controls={panelId}
      >
        ✨
      </button>{' '}
      {showAiExplain && (
        <div className="ai-explain-panel" id={panelId}>
          <div className="ai-explain-header">
            <span>AI Explanation</span>
          </div>
          <div className="ai-explain-content">
            {explanation ? (
              <div className="explanation">
                <p className="summary">{explanation.summary}</p>
                {explanation.inputs.length > 0 && (
                  <div className="inputs">
                    <h4>Inputs:</h4>
                    <ul>
                      {explanation.inputs.map((input, idx) => (
                        <li key={idx}>
                          <strong>{input.name}:</strong> {input.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {explanation.outputs.length > 0 && (
                  <div className="outputs">
                    <h4>Outputs:</h4>
                    <ul>
                      {explanation.outputs.map((output, idx) => (
                        <li key={idx}>{output.description}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {explanation.warnings.length > 0 && (
                  <div className="warnings">
                    <h4>Warnings:</h4>
                    <ul>
                      {explanation.warnings.map((warning, idx) => (
                        <li key={idx}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p>Loading explanation...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
