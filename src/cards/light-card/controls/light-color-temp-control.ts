import { css, CSSResultGroup, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HomeAssistant, isActive, isAvailable, LightEntity } from "../../../ha";
import "../../../shared/slider";
import { getColorTemp } from "../utils";

@customElement("mushroom-light-color-temp-control")
export class LightColorTempControl extends LitElement {
    @property({ attribute: false }) public hass!: HomeAssistant;

    @property({ attribute: false }) public entity!: LightEntity;

    onChange(e: CustomEvent<{ value: number }>): void {
        const value = e.detail.value;

        this.hass.callService("light", "turn_on", {
            entity_id: this.entity.entity_id,
            color_temp_kelvin: value,
        });
    }

    protected render(): TemplateResult {
        const colorTemp = getColorTemp(this.entity);

        return html`
            <mushroom-slider
                .value=${colorTemp}
                .disabled=${!isAvailable(this.entity)}
                .inactive=${!isActive(this.entity)}
                .min=${this.entity.attributes.min_color_temp_kelvin ?? 2000}
                .max=${this.entity.attributes.max_color_temp_kelvin ?? 6500}
                .showIndicator=${true}
                @change=${this.onChange}
            />
        `;
    }

    static get styles(): CSSResultGroup {
        return css`
            mushroom-slider {
                --gradient: -webkit-linear-gradient(right, white 0%, rgb(255, 160, 0) 100%);
            }
        `;
    }
}
