/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {
  Command,
  SfdxCommandBuilder
} from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { DirFileNameSelection } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import { Uri } from 'vscode';
import { nls } from '../../messages';
import { sfdxCoreSettings } from '../../settings';
import {
  CompositeParametersGatherer,
  SelectFileName,
  SelectOutputDir,
  SfdxCommandlet,
  SfdxWorkspaceChecker
} from '../commands';
import {
  FilePathExistsChecker,
  GlobStrategyFactory,
  PathStrategyFactory,
  SourcePathStrategy
} from '../util';
import { BaseTemplateCommand } from './baseTemplateCommand';
import {
  FileInternalPathGatherer,
  InternalDevWorkspaceChecker
} from './internalCommandUtils';
import {
  AURA_DEFINITION_FILE_EXTS,
  AURA_DIRECTORY,
  AURA_INTERFACE_EXTENSION
} from './metadataTypeConstants';

export class ForceLightningInterfaceCreateExecutor extends BaseTemplateCommand {
  public build(data: DirFileNameSelection): Command {
    const builder = new SfdxCommandBuilder()
      .withDescription(nls.localize('force_lightning_interface_create_text'))
      .withArg('force:lightning:interface:create')
      .withFlag('--interfacename', data.fileName)
      .withFlag('--outputdir', data.outputdir)
      .withLogName('force_lightning_interface_create');

    if (sfdxCoreSettings.getInternalDev()) {
      builder.withArg('--internal');
    }

    return builder.build();
  }

  public sourcePathStrategy: SourcePathStrategy = PathStrategyFactory.createBundleStrategy();

  public getDefaultDirectory() {
    return AURA_DIRECTORY;
  }

  public getFileExtension() {
    return AURA_INTERFACE_EXTENSION;
  }
}

const fileNameGatherer = new SelectFileName();
const outputDirGatherer = new SelectOutputDir(AURA_DIRECTORY, true);

export async function forceLightningInterfaceCreate() {
  const commandlet = new SfdxCommandlet(
    new SfdxWorkspaceChecker(),
    new CompositeParametersGatherer<DirFileNameSelection>(
      fileNameGatherer,
      outputDirGatherer
    ),
    new ForceLightningInterfaceCreateExecutor(),
    new FilePathExistsChecker(
      GlobStrategyFactory.createCheckBundleInGivenPath(
        ...AURA_DEFINITION_FILE_EXTS
      ),
      nls.localize(
        'warning_prompt_file_overwrite',
        nls.localize('aura_bundle_message_name')
      )
    )
  );
  await commandlet.run();
}

export async function forceInternalLightningInterfaceCreate(sourceUri: Uri) {
  const commandlet = new SfdxCommandlet(
    new InternalDevWorkspaceChecker(),
    new CompositeParametersGatherer(
      fileNameGatherer,
      new FileInternalPathGatherer(sourceUri)
    ),
    new ForceLightningInterfaceCreateExecutor()
  );
  await commandlet.run();
}
