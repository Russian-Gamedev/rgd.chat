import { Directus } from '@directus/sdk';

class API {
  private client = new Directus('https://cms.rgd.chat/');

  async patrons() {
    const { data } = await this.client.items('patron').readByQuery({
      fields: ['amount', 'user.username', 'user.id', 'user.avatar', 'user.banner'],
      sort: ['-amount'],
    });
    return data || [];
  }
}

export const client = new API();
