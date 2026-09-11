declare global {
  interface Liveblocks {
    // Each user's info is set by the auth endpoint and visible to others.
    UserMeta: {
      id: string;
      info: {
        name: string;
        color: string;
      };
    };
  }
}

export {};
