import type { ISearchQuery } from '../../business/types';
import searches from '../datasets/searches.json';

export class SearchBuilder {
  private term = searches.HEADPHONES.term;

  withData(data: ISearchQuery): this {
    this.term = data.term;
    return this;
  }

  headphones(): this {
    this.term = searches.HEADPHONES.term;
    return this;
  }

  charger(): this {
    this.term = searches.CHARGER.term;
    return this;
  }

  notebook(): this {
    this.term = searches.NOTEBOOK.term;
    return this;
  }

  amazonHeadphones(): this {
    this.term = searches.AMAZON_HEADPHONES.term;
    return this;
  }

  unknown(): this {
    this.term = searches.UNKNOWN.term;
    return this;
  }

  build(): ISearchQuery {
    return { term: this.term };
  }
}
