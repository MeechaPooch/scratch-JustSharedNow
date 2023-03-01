let regen = `(echo authenticate '""'; echo signal newnym; echo quit) | nc localhost 9051`
import {exec,spawn} from 'child_process'
exec(regen)