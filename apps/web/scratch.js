import fs from 'fs';
import path from 'path';

const filePath = path.join('/Users/ankushpatial/VIBE/apps/web/src/context/PlayerContext.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Remove the @ts-ignore and fix the refs from the previous script
content = content.replace(/\/\/ @ts-ignore\n/g, '');
content = content.replace(/fetchSpotifyProfileRef\.current = async \(token: string\) =\> \{/g, 'const fetchSpotifyProfile = async (token: string) => {');
content = content.replace(/handleTrackEndRef\.current = \(\) =\> \{/g, 'const handleTrackEnd = () => {');

// 2. Add useEffects to update the refs AFTER render, instead of during render
const refUpdateBlock = `
  useEffect(() => {
    handleTrackEndRef.current = handleTrackEnd;
    fetchSpotifyProfileRef.current = fetchSpotifyProfile;
  });
`;

content = content.replace(/const fetchSpotifyProfile = async \(token: string\) =\> \{/, refUpdateBlock + '\n  const fetchSpotifyProfile = async (token: string) => {');

// Write it back
fs.writeFileSync(filePath, content, 'utf-8');
console.log("File updated");
