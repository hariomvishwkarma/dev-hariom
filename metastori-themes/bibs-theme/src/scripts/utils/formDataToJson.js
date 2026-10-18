export function formDataToJson(formData) {
  const object = {};

  for (const [key, value] of formData.entries()) {
    const keys = key.split(/[\[\]]/).filter(Boolean);
    let currentLevel = object;

    for (let i = 0; i < keys.length; i++) {
      const isLastKey = i === keys.length - 1;
      const keySegment = keys[i];
      const isArray = !isNaN(parseInt(keySegment, 10));
      const nestedKey = isArray ? parseInt(keySegment, 10) : keySegment;

      if (isLastKey) {
        if (Array.isArray(currentLevel)) {
          currentLevel.push(value);
        } else {
          currentLevel[nestedKey] = value;
        }
      } else {
        if (!currentLevel[nestedKey]) {
          currentLevel[nestedKey] = typeof keys[i + 1] === 'number' ? [] : {};
        }
        currentLevel = currentLevel[nestedKey];
      }
    }
  }

  return object;
}
