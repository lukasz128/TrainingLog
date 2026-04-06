import { HttpClient } from '@angular/common/http';
import {
  Directive,
  ElementRef,
  inject,
  input,
  OnInit,
  Renderer2,
} from '@angular/core';
import { defer, EMPTY, take, tap } from 'rxjs';
import { IconCacheService } from '../../data-access/icon-cache.service';
import { AvailableIcon } from '../../data-access/icon-store';

@Directive({
  selector: 'i[uiIcon]',
  exportAs: 'uiIcon',
})
export class IconDirective implements OnInit {
  private readonly _iconCache = inject(IconCacheService);
  private readonly _http = inject(HttpClient);
  private readonly _elementRef = inject(ElementRef);
  private readonly _renderer = inject(Renderer2);

  readonly icon = input.required<AvailableIcon>({ alias: 'uiIcon' });
  readonly size = input<string | undefined>(undefined);

  private readonly _fetchIcon$ = defer(() => {
    const icon = this.icon();
    const requestedIcon = this._iconCache.getIconBy(icon);
    if (requestedIcon === undefined) {
      console.error(`Provided icon ${icon} doesn't exists`);
      return EMPTY;
    }

    return this._http.get(requestedIcon.path, { responseType: 'text' }).pipe(
      tap({
        next: (svgElement) => this._renderIcon(svgElement, requestedIcon.path),
        error: (err) => console.error(`Couldn't load icon ${icon}`, err),
      }),
      take(1),
    );
  });

  ngOnInit(): void {
    this._fetchIcon$.subscribe();
  }

  private _renderIcon(svgElement: string, iconPath: string) {
    const div = this._renderer.createElement('div') as HTMLDivElement;
    div.innerHTML = svgElement;

    const svgTag = div.querySelector('svg');
    if (svgTag === null) {
      console.error(`Couldn't find svg tag in  ${iconPath} file`);
      return;
    }

    if (this.size() !== undefined)
      this._renderer.setStyle(svgTag, 'width', this.size());
    this._renderer.setStyle(svgTag, 'height', this.size());

    this._renderer.appendChild(this._elementRef.nativeElement, svgTag);
  }
}
