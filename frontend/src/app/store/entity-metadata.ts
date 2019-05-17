/**
 * @license
 * Heye Vöcking All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://telepathy.app/license
 */

import { EntityMetadataMap } from "ngrx-data";

const entityMetadata: EntityMetadataMap = {
  Room: {},
};

const pluralNames = { };

export const entityConfig = {
  entityMetadata,
  pluralNames,
};
