# WeatherApp 

## Como Instalar e Rodar o Projeto

### Pré-requisitos
- Node.js (v18+)
- Gerenciador de pacotes npm
- Ambiente iOS (Xcode) e Android (Android Studio) configurados.

### 1. Clonar e Instalar
```bash
git clone <seu-repositorio>
cd weather-app
npm install --legacy-peer-deps
```

### 2. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:
```bash
cp .env.example .env
```
Abra o arquivo `.env` e insira sua chave da [WeatherAPI](https://www.weatherapi.com/):
```env
EXPO_PUBLIC_WEATHER_API_KEY=sua_chave_real_aqui
```

### 3. Rodar a Aplicação
**Para iOS (Requer Mac):**
```bash
npx expo prebuild --clean # Garante que as permissões nativas de GPS sejam vinculadas
npm run ios
```

**Para Android:**
```bash
npm run android
```

---

## Decisões Arquiteturais e Tecnologias

A aplicação foi construída visando o padrão **Clean Architecture**, onde a regra de negócio não "vaza" para a interface de usuário.

*   **TanStack React Query (+ AsyncStorage Persister)**:
    *   *Justificativa*: A espinha dorsal da aplicação. Responsável por lidar com o gerenciamento de estado do servidor, *loading*, tratativas de erro (*network boundaries*) e cache. Substitui "estados locais + useEffects" frágeis. A integração com o AsyncStorage permitiu atingir o critério de **Offline-first (stale-while-revalidate)**: a aplicação exibe dados cacheados na hora enquanto atualiza em *background*.
*   **Zustand**:
    *   *Justificativa*: Escolhido para gerenciar o estado global **síncrono** do cliente.
*   **Axios (+ Mock Adapter)**:
    *   *Justificativa*: Permitiu testar fluxos assíncronos diretamente, validando a UI contra erros de rede catastróficos.
*   **React Native Gifted Charts**:
    *   *Justificativa*: Utilizado para o gráfico de linha horário (`LineChart`). Foi blindado por um `React.memo` para evitar que a Thread redesenhasse as animações desnecessariamente durante as interações na *Stack Navigation*.
*   **Expo Router**:
    *   *Justificativa*: Roteamento baseado em arquivos, agilizando a navegação por Stacks, padronizando o fluxo de telas.

---

## Limitações e Observações

*   **Aviso de Dispositivo Físico Apple**: O código foi exaustivamente testado em simuladores oficiais do iOS (Xcode). Contudo, *o aplicativo não foi submetido a testes diretos em um dispositivo físico da Apple*.
*   **WeatherAPI Rate Limiting**: A busca dinâmica de cidades utiliza o *tier* gratuito da WeatherAPI. Digitações extremamente rápidas e excessivas podem esbarrar no *Rate Limit* (Erro 429).

---
