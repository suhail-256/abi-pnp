import errorHandler from '../utils/errorUtils';
import { EXPLORER_TX_URLS } from '../../config/explorerUrl';
import { useChainId } from '../stores/useContractStore';
import { useNotificationActions } from '../stores/useNotifications';

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
  return (
    <span className="result-item">
      {String(data)}
      {!singular && ','}
    </span>
  );
};

interface ResultProps {
  data: any;
  isHash?: boolean;
}

function Result({ data, isHash = false }: ResultProps) {
  const chainId = useChainId();
  const { pushNotification } = useNotificationActions();

  if (isHash) {
    return (
      <span className="result-box">
        Tx:&nbsp;
        <a
          href={`${EXPLORER_TX_URLS[chainId]}${data}`}
          target="_blank"
          rel="noopener noreferrer"
          className="result-item result-item--hash"
        >
          {String(data)}
        </a>
      </span>
    );
  }

  try {
    return <div className="result-box">{generateResult(data, 1, true)}</div>;
  } catch (err) {
    console.log(err);
    pushNotification({ msg: errorHandler.getErrorMessage(err), type: 'error' });
    return null;
  }
}

export default Result;
