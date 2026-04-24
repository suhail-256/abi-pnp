import errorHandler from '../utils/errorUtils';

interface ResultProps {
  result: any;
}

function Result({ result }: ResultProps) {
  if (result.isSuccess && result.data !== undefined) {
    if (typeof result.data === 'object')
      return (
        <div className="result-box">
          {result.data.map((item: any, index: number) => (
            <div key={index} className="result-item">
              <span className="result-index">[{index}]</span>
              {item}
            </div>
          ))}
        </div>
      );
    else return <div className="result-box">{String(result.data)}</div>;
  } else if (result.isError)
    return (
      <div className="result-box result-box--error">
        <span className="error-alert-icon" aria-hidden="true">
          !
        </span>
        <span>{errorHandler.getErrorMessage(result.error)}</span>
      </div>
    );
}

export default Result;
