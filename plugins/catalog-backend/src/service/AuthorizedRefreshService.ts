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
import { NotAllowedError } from '@backstage/errors';
import { catalogEntityRefreshPermission } from '@backstage/plugin-catalog-common';
import {
  AuthorizeResult,
  PermissionAuthorizer,
} from '@backstage/plugin-permission-common';
import { RefreshOptions, RefreshService } from './types';

export class AuthorizedRefreshService implements RefreshService {
  constructor(
    private readonly service: RefreshService,
    private readonly permissionApi: PermissionAuthorizer,
  ) {}

  async refresh(options: RefreshOptions) {
    const authorizeResponse = (
      await this.permissionApi.authorize(
        [
          {
            permission: catalogEntityRefreshPermission,
            resourceRef: options.entityRef,
          },
        ],
        { token: options.authorizationToken },
      )
    )[0];
    if (authorizeResponse.result !== AuthorizeResult.ALLOW) {
      throw new NotAllowedError();
    }
    await this.service.refresh(options);
  }
}
