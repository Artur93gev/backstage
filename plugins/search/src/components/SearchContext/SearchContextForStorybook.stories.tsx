/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { ApiProvider } from '@backstage/core-app-api';
import { SearchResultSet } from '@backstage/search-common';
import { TestApiRegistry } from '@backstage/test-utils';
import React, { ComponentProps } from 'react';
import { searchApiRef } from '../../apis';
import { SearchContextProvider as RealSearchContextProvider } from './SearchContext';

type QueryResultProps = {
  mockedResults?: SearchResultSet;
};

/**
 * Utility context provider only for use in Storybook stories. You should use
 * the real `<SearchContextProvider>` exported by `@backstage/plugin-search` in
 * your app instead of this! In some cases (like the search page) it may
 * already be provided on your behalf.
 */
export const SearchContextProvider = (
  props: ComponentProps<typeof RealSearchContextProvider> & QueryResultProps,
) => {
  const { mockedResults, ...contextProps } = props;
  const query: any = () => Promise.resolve(mockedResults || {});
  const apiRegistry = TestApiRegistry.from([searchApiRef, { query }]);

  return (
    <ApiProvider apis={apiRegistry}>
      <RealSearchContextProvider {...contextProps} />
    </ApiProvider>
  );
};
