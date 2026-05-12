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
npx expo prebuild --clean
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

## Dispositivos Testados

* **Tablet Android** (Dispositivo Físico)
* **Celular Android** (Emulador)
* **Celular iOS / iPhone** (Simulador Xcode)

---

## Limitações

*   **WeatherAPI (Plano Gratuito)**: A aplicação consome a API no *tier* gratuito, o que restringe a cota mensal de consultas e a profundidade de dados de previsão. Para o risco de erros de *Rate Limit* (429) por excesso de chamadas foi utilizado o hook customizado `useDebounce` na barra de pesquisa.
*   **Defasagem Temporária de Cache (Offline-First)**: Devido à arquitetura de persistência (React Query + AsyncStorage), o aplicativo prioriza mostrar a tela imediatamente com os últimos dados salvos no disco. Isso significa que o usuário pode ver a temperatura antiga até que o *revalidate* em *background* termine e atualize os números na tela.
---

## Próximos Passos

Abaixo estão algumas melhorias e funcionalidades planejadas para o futuro da aplicação:

*   **Histórico de Pesquisas (Recent Searches)**: Armazenar as últimas cidades pesquisadas no disco (`AsyncStorage`) e sugeri-las ao usuário.
*   **Testes End-to-End (E2E)**: Configuração de frameworks para testes end-to-end.
*   **Aprimoramento de Rate Limit**: Implementar um sistema mais robusto de *retry* exponencial ou um *fallback* amigável caso exceda a cota da API gratuita.
*   **Internacionalização (i18n)**: Suporte para múltiplos idiomas, permitindo que a interface e os dados da API (que já suporta queries `lang`) sejam exibidos no idioma do aparelho.
* **Padronizacao de estilos globais**: Padronização de estilos globais, como cores, fontes, etc. Com bibliotecas como [Restyle](https://github.com/shopify/restyle).


