import { BigNumber } from 'ethers';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { useState, useRef, useEffect } from 'react';

import { Toggle } from '../Toggle';
import ethereum from '../../ethereum';
import { useWallet } from '../../hooks';

const ruleTypeOptions = [
  {
    label: 'AML',
    value: 0,
  },
  {
    label: 'KYC',
    value: 1,
  },
  {
    label: 'AML | KYC',
    value: 2,
  },
];

const defaultRuleType = ruleTypeOptions[0].value;

const ruleType2RuleId = {
  0: '431040',
  1: '777',
  2: '631050090',
};

const TheForm = () => {
  const signFormRef = useRef();
  const { account, networkId, activeNetwork } = useWallet();

  const [address, setAddress] = useState('');
  const [ruleType, setRuleType] = useState(defaultRuleType);
  const [ruleId, setRuleId] = useState(ruleType2RuleId[defaultRuleType]);
  const [chainId, setChainId] = useState('1');

  const [receiver, setReceiver] = useState('0x624a4AA4f0D19eDe4DdD5077dEBF98E96Bd6971f');
  const [message, setMessage] = useState('');
  const [clientSignature, setClientSignature] = useState('');
  const [tokenAddress, setTokenAddress] = useState('0xc2132d05d31c914a87c6611c10748aeb04b58e8f');
  const [amount, setAmount] = useState('10');

  const [signLoading, setSignLoading] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);

  const [responseData, setResponseData] = useState();

  const [error, setError] = useState('');

  useEffect(() => {
    setChainId(networkId);
  }, [networkId]);

  useEffect(() => {
    setAddress(account);
    setRuleType(defaultRuleType);
    setMessage('');
    setClientSignature('');
    setResponseData(undefined);
  }, [account]);

  useEffect(() => {
    setRuleId(ruleType2RuleId[ruleType]);
    setMessage('');
    setClientSignature('');
    setResponseData(undefined);
  }, [ruleType]);

  const loading = signLoading || requestLoading;

  const dummyChangeHandler = () => {};

  const ruleChangeHandler = (e) => {
    if (!loading) {
      setRuleType(+e.target.value);
    }
  };

  const chainChangeHandler = (e) => {
    setChainId(Number(e.target.value));
    setMessage('');
    setClientSignature('');
    setResponseData(undefined);
  };

  const checkValidity = (theRef) => {
    const isValid = theRef.current.checkValidity();
    if (!isValid) {
      theRef.current.reportValidity();
    }
    return isValid;
  };

  const signMessageHandler = async (e) => {
    const isValid = checkValidity(signFormRef);

    if (isValid) {
      try {
        setSignLoading(true);

        const data = /431/.test(ruleId) ? {
          sender: address,
          ruleId: ruleId,
          chainId: Number(chainId),
        } : {
          sender: address,
          ruleId: ruleId,
          receiver,
          token: tokenAddress,
          amount: BigNumber.from(amount).toHexString(),
          chainId: Number(chainId),
        };

        const message = JSON.stringify(data);
        const signer = ethereum.getSigner();

        const signature = await signer.signMessage(message);

        setMessage(message);
        setClientSignature(signature);
        setResponseData(undefined);
      } catch (error) {
        setError(error.message);
      } finally {
        setSignLoading(false);
      }
    }
  };

  const submitRequestHandler = async (e) => {
    try {
      setRequestLoading(true);
      setResponseData();

      const payload = {
        message,
        signature: clientSignature,
      };

      const url = process.env.REACT_APP_BACK_URL;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if(response.ok) {
        console.log('response', response);
        setError('');
        const res = await response.text();
        setResponseData(res);
      } else {
        const error = await response.json();

        setResponseData();
        setError(error.message);
      }
    } catch (error) {
      setResponseData();
      setError(error.message);
    } finally {
      setRequestLoading(false);
    }
  };

  if (!account) {
    return (
      <Container fluid className="mb-4">
        <div className="alert alert-primary mb-2" role="alert">
          Connect wallet to proceed
        </div>
      </Container>
    );
  }

  if (networkId !== activeNetwork.networkId) {
    return (
      <Container fluid className="mb-4">
        <div className="alert alert-primary mb-2" role="alert">
          Switch network to Ethereum
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="mb-4">
      {error && (
        <div className="alert alert-danger mb-3" role="alert">
          {error}
          <button
            type="button"
            className="close"
            data-dismiss="alert"
            aria-label="Close"
            onClick={() => setError('')}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )}

      <Row>
        <Col xs={{
          span: 6,
          offset: 3
        }}>
          <h4 className="mb-4">Input Data</h4>
          <Form ref={signFormRef}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="sender">Sender</Form.Label>
              <Form.Control
                type="text"
                id="sender"
                name="sender"
                value={address}
                onChange={dummyChangeHandler}
                minLength="42"
                maxLength="42"
                placeholder="0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB"
                readOnly
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="tokenAddress">Token address</Form.Label>
              <Form.Control
                type="text"
                id="tokenAddress"
                name="tokenAddress"
                value={tokenAddress}
                onChange={(el) => setTokenAddress(el.target.value)}
                minLength="42"
                maxLength="42"
                placeholder="0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="amount">
                Amount
              </Form.Label>
              <Form.Control
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0.00001"
                step="0.00001"
                placeholder="0.01"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="receiver">Receiver</Form.Label>
              <Form.Control
                type="text"
                id="receiver"
                name="receiver"
                value={receiver}
                onChange={(el) => setReceiver(el.target.value)}
                minLength="42"
                maxLength="42"
                placeholder="0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="ruleType">Rule Type</Form.Label>
              <Toggle
                name="ruleType"
                value={ruleType}
                options={ruleTypeOptions}
                onChange={ruleChangeHandler}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="ruleId">Rule Id</Form.Label>
              <Form.Control
                type="number"
                id="ruleId"
                name="ruleId"
                value={ruleId}
                onChange={dummyChangeHandler}
                step="1"
                min="431001"
                max="731100"
                placeholder="431040"
                readOnly
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="ruleId">Chain Id</Form.Label>
              <Form.Control
                as="select"
                name="chainId"
                aria-label="Default select example"
                value={chainId || ''}
                onChange={chainChangeHandler}
                readOnly
                disabled
                required
              >
                <option value="1">Ethereum</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Button
                variant="secondary"
                type="button"
                onClick={signMessageHandler}
                disabled={loading}
                block
              >
                Sign Message
              </Button>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="message">Generated message</Form.Label>
              <Form.Control
                id="message"
                as="textarea"
                rows={7}
                value={
                  message
                    ? JSON.stringify(JSON.parse(message), undefined, 2)
                    : ''
                }
                onChange={() => {}}
                required
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="clientSignature">Signature</Form.Label>
              <Form.Control
                id="clientSignature"
                as="textarea"
                rows={4}
                value={clientSignature}
                onChange={() => {}}
                required
                readOnly
              />
            </Form.Group>
            <Button
              variant="secondary"
              type="button"
              onClick={submitRequestHandler}
              disabled={loading || !message || !clientSignature}
              block
            >
              Verify rule
            </Button>

            <h4 className="mb-4">Issuer Response</h4>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="responseData">Data</Form.Label>
              <Form.Control
                id="responseData"
                as="textarea"
                rows={8}
                value={responseData}
                onChange={() => {}}
                required
                readOnly
              />
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default TheForm;
