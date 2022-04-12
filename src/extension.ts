import { commands, debug, ExtensionContext, Uri, window } from 'vscode'

import { DebugProvider } from './DebugProvider'
import { PanelManager } from './PanelManager'

export function activate(ctx: ExtensionContext) {
  const manager = new PanelManager(ctx)
  const debugProvider = new DebugProvider(manager)

  ctx.subscriptions.push(

    debug.registerDebugConfigurationProvider(
      'browse-lite',
      debugProvider.getProvider(),
    ),

    commands.registerCommand('browse-lite.open', async(url?: string | Uri) => {
      try {
        return await manager.create(url)
      }
      catch (e) {
        console.error(e)
      }
    }),

    commands.registerCommand('browse-lite.openActiveFile', () => {
      const filename = window.activeTextEditor?.document?.fileName
      manager.createFile(filename)
    }),

    commands.registerCommand('browse-lite.controls.refresh', () => {
      manager.current?.reload()
    }),

    commands.registerCommand('browse-lite.controls.external', () => {
      manager.current?.openExternal(true)
    }),

    commands.registerCommand('browse-lite.controls.debug', async() => {
      const panel = await manager.current?.createDebugPanel()
      panel?.show()
    }),

  )

  try {
    // https://code.visualstudio.com/updates/v1_53#_external-uri-opener
    // @ts-expect-error proposed API
    ctx.subscriptions.push(window.registerExternalUriOpener?.(
      'browse-lite.opener',
      {
        canOpenExternalUri: () => 2,
        openExternalUri(resolveUri: Uri) {
          manager.create(resolveUri)
        },
      },
      {
        schemes: ['http', 'https'],
        label: 'Open URL using Browse Lite',
      },
    ))
  }
  catch {}
}
