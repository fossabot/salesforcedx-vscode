import { PathStrategyFactory, SourcePathStrategy } from '../commands/util';

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const DEFINITIONS: { [key: string]: MetadataInfo } = {
  apexclass: {
    type: 'ApexClass',
    suffix: 'cls',
    directory: 'classes',
    pathStrategy: PathStrategyFactory.createDefaultStrategy(),
    extensions: ['.cls']
  },
  apexcomponent: {
    type: 'ApexComponent',
    suffix: 'component',
    directory: 'components',
    pathStrategy: PathStrategyFactory.createDefaultStrategy(),
    extensions: ['.component']
  },
  apexpage: {
    type: 'ApexPage',
    suffix: 'page',
    directory: 'pages',
    pathStrategy: PathStrategyFactory.createDefaultStrategy(),
    extensions: ['.page']
  },
  apextrigger: {
    type: 'ApexTrigger',
    suffix: 'trigger',
    directory: 'triggers',
    pathStrategy: PathStrategyFactory.createDefaultStrategy(),
    extensions: ['.trigger']
  },
  aurabundledefinition: {
    type: 'AuraBundleDefinition',
    suffix: 'cmp',
    directory: 'aura',
    pathStrategy: PathStrategyFactory.createBundleStrategy(),
    extensions: ['.app', '.cmp', '.evt', '.intf']
  },
  lightningcomponentbundle: {
    type: 'LightningComponentBundle',
    suffix: 'js',
    directory: 'lwc',
    pathStrategy: PathStrategyFactory.createBundleStrategy(),
    extensions: ['.js', '.html']
  }
};

export class MetadataDictionary {
  public static getMetadataInfo(metadataType: string) {
    return DEFINITIONS[metadataType.toLowerCase()];
  }

  public static getFileExtensions(metadataType: string): string[] {
    const info = DEFINITIONS[metadataType.toLowerCase()];
    const extensions = [`.${info.suffix}-meta.xml`];
    if (info.extensions) {
      extensions.push(...info.extensions);
    }
    return extensions;
  }
}

export type MetadataInfo = {
  type: string;
  suffix: string;
  directory: string;
  pathStrategy: SourcePathStrategy;
  extensions?: string[];
};
