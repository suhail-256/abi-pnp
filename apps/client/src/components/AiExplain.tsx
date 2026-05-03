import { useState, useEffect } from 'react';
import explainService from '../services/explainService';
import { useContract } from '../context/ContractContext';
import { AbiFunction } from '../types/contract';

export default function AiExplain({ fnInfo }: { fnInfo: AbiFunction }) {
  const { contractSource } = useContract();
  const [showAiExplain, setShowAiExplain] = useState(false);
  const [explanation, setExplanation] = useState<{
    summary: string;
    inputs: { name: string; description: string }[];
    outputs: { description: string }[];
    warnings: string[];
  } | null>(null);

  

  const toggleExplainPanel = async () => {
    if (showAiExplain) {
      setShowAiExplain(false);
      return;
    }
    setShowAiExplain(true);
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
        className={`ai-explain-toggle ${showAiExplain ? 'active' : ''}`}
        onClick={toggleExplainPanel}
        title="AI Explain"
      >
        ✨
      </button>{' '}
      {showAiExplain && (
        <div className="ai-explain-panel">
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
