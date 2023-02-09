import { Directus } from '@directus/sdk';
import { Collections } from './api.type';

class API {
  private client = new Directus<Collections>('https://cms.rgd.chat/');

  async patrons() {
    const { data } = await this.client.items('patron').readByQuery({
      fields: [
        'amount',
        'user.username',
        'user.id',
        'user.avatar',
        'user.banner',
        'user.banner_alt',
        'user.banner_color',
      ],
      sort: ['-amount'],
    });
    return data || [];
  }
}

export const client = new API();
