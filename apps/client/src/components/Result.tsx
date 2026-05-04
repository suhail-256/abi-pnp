import errorHandler from '../utils/errorUtils';

interface ResultProps {
  data: any;
}

const generateResult = (data: any, depth: number = 1, singular: boolean = false): any => {
  if (data === null) return <span className="result-item">null</span>;
  const indent = '|  '.repeat(depth);
  const closingIndent = '|  '.repeat(depth - 1);

  if (Array.isArray(data))
    return (
      <span>
        {'[\n'}
        {data.map((item: any, index: number) => (
          <div key={index} style={{ whiteSpace: 'pre' }}>
            <span className="result-indent">{indent}</span>
            {generateResult(item, depth + 1)}
          </div>
        ))}
        <div style={{ whiteSpace: 'pre' }}>
          <span className="result-indent">{closingIndent}</span>
          {']'}
        </div>
      </span>
    );
  else if (typeof data === 'object') {
    return (
      <span>
        {'{\n'}
        {Object.entries(data).map(([key, value], index) => (
          <div key={index} style={{ whiteSpace: 'pre' }}>
            <span className="result-indent">{indent}</span>
            <span className="result-key">{key}: </span>
            {generateResult(value, depth + 1)}
          </div>
        ))}
        <div style={{ whiteSpace: 'pre' }}>
          <span className="result-indent">{closingIndent}</span>
          {'}'}
        </div>
      </span>
    );
  }
  return <span className="result-item">{String(data)}{!singular && ','}</span>;
};

function Result({ data }: ResultProps) {
  try {
    return <div className="result-box">{generateResult(data, 1, true)}</div>;
  } catch (err) {
    console.log(err);

    return (
      <div className="result-box result-box--error">
        <span className="error-alert-icon" aria-hidden="true">
          !
        </span>
        <span>{errorHandler.getErrorMessage(err)}</span>
      </div>
    );
  }
}

export default Result;
