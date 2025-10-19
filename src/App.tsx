import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { connectPhyClient, type PhyHubClient } from '@phystack/hub-client';
import { getDevSettings, isDevMode } from './utils/dev-mode';
import logo from './phystack-logo.svg';
import type { Settings } from './schema';

interface AppState {
  client: PhyHubClient | null;
  settings: Settings | null;
  signals: PhyHubClient['signals'] | null;
  error: Error | null;
  isLoading: boolean;
}

function App() {
  const [state, setState] = useState<AppState>({
    client: null,
    settings: null,
    signals: null,
    error: null,
    isLoading: true,
  });

  useEffect(() => {
    let cancelled = false;

    const initialize = async () => {
      try {
        if (isDevMode()) {
          const settings = await getDevSettings();
          if (!cancelled) {
            setState({
              client: null,
              settings,
              signals: null,
              error: null,
              isLoading: false,
            });
          }
        } else {
          const client = await connectPhyClient();
          const signals = await client.initializeSignals();
          const settings = await client.getSettings() as Settings;

          if (!cancelled) {
            setState({
              client,
              settings,
              signals,
              error: null,
              isLoading: false,
            });
          }
        }
      } catch (err) {
        console.error('Error initializing app:', err);
        if (!cancelled) {
          setState(prev => ({
            ...prev,
            error: err instanceof Error ? err : new Error('Failed to initialize'),
            isLoading: false,
          }));
        }
      }
    };

    initialize();

    return () => {
      cancelled = true;
    };
  }, []);

  if (state.error) {
    return (
      <Container>
        <ErrorMessage>
          <ErrorTitle>Failed to load</ErrorTitle>
          <ErrorDetails>{state.error.message}</ErrorDetails>
        </ErrorMessage>
      </Container>
    );
  }

  if (state.isLoading || !state.settings) {
    return <Container>Loading gridapp settings...</Container>;
  }

  const { productName, productPrice } = state.settings;

  return (
    <Container>
      <ProductInfo>
        <Logo src={logo} alt="Phystack" />
        <Title>Phystack React App</Title>
        <SettingsDisplay>
          <SettingItem>
            <Label>Product name:</Label>
            <Value>{productName}</Value>
          </SettingItem>
          <SettingItem>
            <Label>Product price:</Label>
            <Value>{productPrice}</Value>
          </SettingItem>
        </SettingsDisplay>
      </ProductInfo>
    </Container>
  );
}

const Container = styled.div`
  text-align: center;
  background-color: #000000;
  height: 100%;
  position: absolute;
  display: flex;
  flex-direction: row;
  width: 100%;
  color: white;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 1.5vmin);
`;

const ProductInfo = styled.header`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-bottom: 64px;
  align-items: center;
  justify-content: center
`;

const Logo = styled.img`
  width: 40%;
  height: auto;
  margin-bottom: 2rem;
  pointer-events: none;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 300;
  margin: 0 0 3rem 0;
  color: #fff;
`;

const SettingsDisplay = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 600px;
  width: 100%;
`;

const SettingItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.div`
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.7;
`;

const Value = styled.div`
  font-size: 1.5rem;
  font-weight: 500;
`;

const ErrorMessage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  max-width: 500px;
`;

const ErrorTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 500;
  color: #ff6b6b;
  margin: 0;
`;

const ErrorDetails = styled.p`
  font-size: 1rem;
  opacity: 0.8;
  margin: 0;
`;

export default App;
