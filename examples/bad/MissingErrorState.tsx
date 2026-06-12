export async function SaveProfile() {
  try {
    await saveProfile();
  } catch (error) {
    console.error(error);
  }

  return <button>Save profile</button>;
}
