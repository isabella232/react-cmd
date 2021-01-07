import React, { useRef, useMemo } from 'react'
import { useMountedLogic, useValues, useActions } from 'kea'
import { commandPaletteLogic } from './commandPaletteLogic'
import { CommandInput } from './CommandInput'
import { CommandResults } from './CommandResults'
import { useOutsideClickHandler } from './hooks/useOutsideClickHandler'
import { useEventListener } from './hooks/useEventListener'
import './index.scss'

export function CommandPalette(): JSX.Element | null {
    useMountedLogic(commandPaletteLogic)

    const { setInput, hidePalette, togglePalette, executeResult, backFlow } = useActions(commandPaletteLogic)
    const { input, isPaletteShown, isSqueak, activeFlow, commandSearchResults } = useValues(commandPaletteLogic)

    const squeakAudio: HTMLAudioElement | null = useMemo(
        // optimized to load the file only once and only when needed
        () =>
            squeakAudio ||
            (isSqueak ? new Audio('https://raw.githubusercontent.com/PostHog/react-cmd/main/squeak.mp3') : null),
        [isSqueak]
    )

    const boxRef = useRef<HTMLDivElement | null>(null)

    useEventListener('keydown', (event: KeyboardEvent) => {
        if (isSqueak && event.key === 'Enter') {
            squeakAudio?.play()
        } else if (event.key === 'Escape') {
            event.preventDefault()
            // Return to previous flow
            if (activeFlow) {
                backFlow()
            }
            // If no flw, erase input
            else if (input) {
                setInput('')
            }
            // Lastly hide palette
            else {
                hidePalette()
            }
        } else if (event.key === 'k' && (event.ctrlKey || event.metaKey)) {
            event.preventDefault()
            togglePalette()
        }
    })

    useOutsideClickHandler(
        boxRef,
        () => {
            if (isPaletteShown) {
                hidePalette()
            }
        },
        [boxRef, isPaletteShown]
    )

    return !isPaletteShown ? null : (
        <div className="palette__overlay">
            <div className="palette__box" ref={boxRef}>
                {(!activeFlow || activeFlow.instruction) && <CommandInput />}
                {!commandSearchResults.length && !activeFlow ? null : <CommandResults executeResult={executeResult} />}
            </div>
        </div>
    )
}
